namespace AppThoaiVien
{
	partial class Form1
	{
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.btnGui = new System.Windows.Forms.Button();
			this.txtGhiChu = new System.Windows.Forms.TextBox();
			this.label3 = new System.Windows.Forms.Label();
			this.cbbLoai = new System.Windows.Forms.ComboBox();
			this.txtDiaChi = new System.Windows.Forms.TextBox();
			this.label2 = new System.Windows.Forms.Label();
			this.label1 = new System.Windows.Forms.Label();
			this.txtSDT = new System.Windows.Forms.TextBox();
			this.label4 = new System.Windows.Forms.Label();
			this.txtHoTen = new System.Windows.Forms.TextBox();
			this.label5 = new System.Windows.Forms.Label();
			this.btnGoi = new System.Windows.Forms.Button();
			this.btnXem = new System.Windows.Forms.Button();
			this.SuspendLayout();
			// 
			// btnGui
			// 
			this.btnGui.Location = new System.Drawing.Point(13, 256);
			this.btnGui.Name = "btnGui";
			this.btnGui.Size = new System.Drawing.Size(125, 33);
			this.btnGui.TabIndex = 5;
			this.btnGui.Text = "Đăng ký";
			this.btnGui.UseVisualStyleBackColor = true;
			this.btnGui.Click += new System.EventHandler(this.btnGui_Click);
			// 
			// txtGhiChu
			// 
			this.txtGhiChu.Location = new System.Drawing.Point(137, 177);
			this.txtGhiChu.Multiline = true;
			this.txtGhiChu.Name = "txtGhiChu";
			this.txtGhiChu.Size = new System.Drawing.Size(336, 73);
			this.txtGhiChu.TabIndex = 4;
			this.txtGhiChu.Text = "Thường";
			// 
			// label3
			// 
			this.label3.AutoSize = true;
			this.label3.Location = new System.Drawing.Point(10, 180);
			this.label3.Name = "label3";
			this.label3.Size = new System.Drawing.Size(57, 17);
			this.label3.TabIndex = 11;
			this.label3.Text = "Ghi chú";
			// 
			// cbbLoai
			// 
			this.cbbLoai.FormattingEnabled = true;
			this.cbbLoai.Items.AddRange(new object[] {
            "Thường",
            "Premium"});
			this.cbbLoai.Location = new System.Drawing.Point(137, 68);
			this.cbbLoai.Name = "cbbLoai";
			this.cbbLoai.Size = new System.Drawing.Size(336, 24);
			this.cbbLoai.TabIndex = 2;
			// 
			// txtDiaChi
			// 
			this.txtDiaChi.Location = new System.Drawing.Point(137, 98);
			this.txtDiaChi.Multiline = true;
			this.txtDiaChi.Name = "txtDiaChi";
			this.txtDiaChi.Size = new System.Drawing.Size(336, 73);
			this.txtDiaChi.TabIndex = 3;
			this.txtDiaChi.Text = "227 Nguyễn Văn Cừ Quận 5 TPHCM";
			// 
			// label2
			// 
			this.label2.AutoSize = true;
			this.label2.Location = new System.Drawing.Point(10, 71);
			this.label2.Name = "label2";
			this.label2.Size = new System.Drawing.Size(53, 17);
			this.label2.TabIndex = 8;
			this.label2.Text = "Loại xe";
			// 
			// label1
			// 
			this.label1.AutoSize = true;
			this.label1.Location = new System.Drawing.Point(10, 101);
			this.label1.Name = "label1";
			this.label1.Size = new System.Drawing.Size(121, 17);
			this.label1.TabIndex = 7;
			this.label1.Text = "Địa chỉ đón khách";
			// 
			// txtSDT
			// 
			this.txtSDT.Location = new System.Drawing.Point(137, 40);
			this.txtSDT.Name = "txtSDT";
			this.txtSDT.Size = new System.Drawing.Size(336, 22);
			this.txtSDT.TabIndex = 1;
			this.txtSDT.Text = "0123456789";
			// 
			// label4
			// 
			this.label4.AutoSize = true;
			this.label4.Location = new System.Drawing.Point(10, 43);
			this.label4.Name = "label4";
			this.label4.Size = new System.Drawing.Size(91, 17);
			this.label4.TabIndex = 13;
			this.label4.Text = "Số điện thoại";
			// 
			// txtHoTen
			// 
			this.txtHoTen.Location = new System.Drawing.Point(137, 12);
			this.txtHoTen.Name = "txtHoTen";
			this.txtHoTen.Size = new System.Drawing.Size(336, 22);
			this.txtHoTen.TabIndex = 0;
			this.txtHoTen.Text = "Lê Thành An";
			// 
			// label5
			// 
			this.label5.AutoSize = true;
			this.label5.Location = new System.Drawing.Point(10, 15);
			this.label5.Name = "label5";
			this.label5.Size = new System.Drawing.Size(50, 17);
			this.label5.TabIndex = 15;
			this.label5.Text = "Họ tên";
			// 
			// btnGoi
			// 
			this.btnGoi.Location = new System.Drawing.Point(186, 257);
			this.btnGoi.Name = "btnGoi";
			this.btnGoi.Size = new System.Drawing.Size(125, 32);
			this.btnGoi.TabIndex = 16;
			this.btnGoi.Text = "Gọi xe";
			this.btnGoi.UseVisualStyleBackColor = true;
			this.btnGoi.Click += new System.EventHandler(this.btnGoi_Click);
			// 
			// btnXem
			// 
			this.btnXem.Location = new System.Drawing.Point(348, 256);
			this.btnXem.Name = "btnXem";
			this.btnXem.Size = new System.Drawing.Size(125, 33);
			this.btnXem.TabIndex = 17;
			this.btnXem.Text = "Xem lịch sử";
			this.btnXem.UseVisualStyleBackColor = true;
			this.btnXem.Click += new System.EventHandler(this.btnXem_Click);
			// 
			// Form1
			// 
			this.AcceptButton = this.btnGui;
			this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(485, 299);
			this.Controls.Add(this.btnXem);
			this.Controls.Add(this.btnGoi);
			this.Controls.Add(this.txtHoTen);
			this.Controls.Add(this.label5);
			this.Controls.Add(this.txtSDT);
			this.Controls.Add(this.label4);
			this.Controls.Add(this.btnGui);
			this.Controls.Add(this.txtGhiChu);
			this.Controls.Add(this.label3);
			this.Controls.Add(this.cbbLoai);
			this.Controls.Add(this.txtDiaChi);
			this.Controls.Add(this.label2);
			this.Controls.Add(this.label1);
			this.Name = "Form1";
			this.Text = "App thoại viên";
			this.Load += new System.EventHandler(this.Form1_Load);
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.Button btnGui;
		private System.Windows.Forms.TextBox txtGhiChu;
		private System.Windows.Forms.Label label3;
		private System.Windows.Forms.ComboBox cbbLoai;
		private System.Windows.Forms.TextBox txtDiaChi;
		private System.Windows.Forms.Label label2;
		private System.Windows.Forms.Label label1;
		private System.Windows.Forms.TextBox txtSDT;
		private System.Windows.Forms.Label label4;
		private System.Windows.Forms.TextBox txtHoTen;
		private System.Windows.Forms.Label label5;
		private System.Windows.Forms.Button btnGoi;
		private System.Windows.Forms.Button btnXem;
	}
}

