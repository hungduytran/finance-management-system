import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        padding: "24px 0",
        backgroundColor: "#222",
      }}
    >
      <Typography
        variant="body2"
        color="#FFFFFF"
        textAlign="center"
        sx={{ marginLeft: 2 }}
      >
        Sử dụng trang web này tức là bạn đồng ý với Điều khoản sử dụng và Chính
        sách bảo mật của chúng tôi.
      </Typography>
      <div className="mt-2 flex flex-row items-center justify-center">
        <a href="#" className="text-[#4d94ff] hover:text-[#0a58ca]">
          Điều khoản dịch vụ
        </a>
        <Typography
          variant="body2"
          color="#FFFFFF"
          sx={{ marginLeft: 1, marginRight: 1 }}
        >
          -
        </Typography>
        <a href="#" className="text-[#4d94ff] hover:text-[#0a58ca]">
          Chính sách Riêng tư
        </a>
      </div>
      <Typography variant="body2" color="#FFFFFF" sx={{ marginLeft: 2 }}>
        &copy; 2025 Money Lover.
      </Typography>
    </Box>
  );
};

export default Footer;
