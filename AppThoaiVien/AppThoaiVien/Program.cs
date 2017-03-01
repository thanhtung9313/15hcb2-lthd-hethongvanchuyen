using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AppThoaiVien
{
	public class MyResult
	{
		public int Error { get; set; }
		public String Text { get; set; }
		public List<Data> Data { get; set; }
	}
	public class Data
	{
		public String DiaChi { get; set; }
		public String TinhTrang { get; set; }
		public String Ngay { get; set; }
	}
	static class Program
	{
		/// <summary>
		/// The main entry point for the application.
		/// </summary>
		[STAThread]
		static void Main()
		{
			Application.EnableVisualStyles();
			Application.SetCompatibleTextRenderingDefault(false);
			Application.Run(new Form1());
		}
	}
}
