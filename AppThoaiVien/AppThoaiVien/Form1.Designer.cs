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
			this.SuspendLayout();
			// 
			// btnGui
			// 
			this.btnGui.Location = new System.Drawing.Point(138, 200);
			this.btnGui.Name = "btnGui";
			this.btnGui.Size = new System.Drawing.Size(125, 23);
			this.btnGui.TabIndex = 3;
			this.btnGui.Text = "Gửi";
			this.btnGui.UseVisualStyleBackColor = true;
			this.btnGui.Click += new System.EventHandler(this.btnGui_Click);
			// 
			// txtGhiChu
			// 
			this.txtGhiChu.Location = new System.Drawing.Point(138, 121);
			this.txtGhiChu.Multiline = true;
			this.txtGhiChu.Name = "txtGhiChu";
			this.txtGhiChu.Size = new System.Drawing.Size(336, 73);
			this.txtGhiChu.TabIndex = 2;
			// 
			// label3
			// 
			this.label3.AutoSize = true;
			this.label3.Location = new System.Drawing.Point(11, 124);
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
			this.cbbLoai.Location = new System.Drawing.Point(138, 12);
			this.cbbLoai.Name = "cbbLoai";
			this.cbbLoai.Size = new System.Drawing.Size(336, 24);
			this.cbbLoai.TabIndex = 0;
			// 
			// txtDiaChi
			// 
			this.txtDiaChi.Location = new System.Drawing.Point(138, 42);
			this.txtDiaChi.Multiline = true;
			this.txtDiaChi.Name = "txtDiaChi";
			this.txtDiaChi.Size = new System.Drawing.Size(336, 73);
			this.txtDiaChi.TabIndex = 1;
			// 
			// label2
			// 
			this.label2.AutoSize = true;
			this.label2.Location = new System.Drawing.Point(11, 15);
			this.label2.Name = "label2";
			this.label2.Size = new System.Drawing.Size(53, 17);
			this.label2.TabIndex = 8;
			this.label2.Text = "Loại xe";
			// 
			// label1
			// 
			this.label1.AutoSize = true;
			this.label1.Location = new System.Drawing.Point(11, 45);
			this.label1.Name = "label1";
			this.label1.Size = new System.Drawing.Size(121, 17);
			this.label1.TabIndex = 7;
			this.label1.Text = "Địa chỉ đón khách";
			// 
			// Form1
			// 
			this.AcceptButton = this.btnGui;
			this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(485, 230);
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
	}
}

