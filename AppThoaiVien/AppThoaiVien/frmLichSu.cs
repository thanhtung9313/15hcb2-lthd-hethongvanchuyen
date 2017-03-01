using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AppThoaiVien
{
	public partial class frmLichSu : Form
	{
		public frmLichSu(MyResult Data)
		{
			InitializeComponent();
			var i = 0;
			foreach (var item in Data.Data)
			{
				i++;
				ListViewItem lvi = new ListViewItem(i.ToString());
				lvi.SubItems.Add(item.Ngay);
				lvi.SubItems.Add(item.TinhTrang);
				lvi.SubItems.Add(item.DiaChi);
				lvwLichSu.Items.Add(lvi);
			}
		}
	}
}
