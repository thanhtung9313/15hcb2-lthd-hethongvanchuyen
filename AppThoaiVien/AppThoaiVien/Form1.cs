using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Http;
using System.Configuration;

namespace AppThoaiVien
{
	public partial class Form1 : Form
	{
		private String URL = ConfigurationManager.AppSettings["mapapi"].ToString();
		class MyResult
		{
			public int Error { get; set; }
			public String Text { get; set; }
		}
		public Form1()
		{
			InitializeComponent();
		}

		private void btnGui_Click(object sender, EventArgs e)
		{
			using(var c = new HttpClient())
			{
				c.DefaultRequestHeaders.Accept.Clear();
				c.DefaultRequestHeaders.Accept.Add(
					new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

				var res = c.PostAsJsonAsync(URL + "register",
					new { DiaChi = txtDiaChi.Text, GhiChu = txtGhiChu.Text, LoaiXe = cbbLoai.SelectedIndex}).Result;
				if (res.StatusCode == System.Net.HttpStatusCode.OK)
				{
					var info = res.Content.ReadAsAsync<MyResult>().Result;
					if (info.Error == 0)
					{
						MessageBox.Show(info.Text, "Thành công", MessageBoxButtons.OK, MessageBoxIcon.Information);
					}
					else
					{
						MessageBox.Show(info.Text, "Thất bại", MessageBoxButtons.OK, MessageBoxIcon.Error);
					}
				}
			}
 		}

		private void Form1_Load(object sender, EventArgs e)
		{
			cbbLoai.SelectedIndex = 0;
		}
	}
}
