import { Typography, Divider, Image } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import wagnerPhoto from "../../assets/logo.png";
const { Title, Text } = Typography;

const HeaderPortfolio = () => (
  <div style={{ textAlign: "center", marginTop: 12 }}>
    <Image
      width={150}
      src={wagnerPhoto}
      alt='Foto do Wagner'
      style={{ marginBottom: "16px" }}
    />
    <Title style={{ marginTop: 0, marginBottom: 0 }} level={3}>
      Wagner Esser
    </Title>
    <Title
      type='secondary'
      level={5}
      style={{ marginTop: 0, marginBottom: "8px" }}
    >
      Software Engineer
    </Title>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        marginTop: 48,
      }}
    >
      <CodeOutlined
        style={{
          fontSize: 36,
          marginBottom: 16,
          color: "#424242",
        }}
      />
      <Title level={2} style={{ marginLeft: 10 }}>
        Meu Portfólio Pessoal
      </Title>
    </div>

    <Text
      type='secondary'
      style={{ fontSize: "16px", display: "block", marginBottom: "48px" }}
    >
      Explorando componentes, APIs e lógica robusta para criar aplicações que
      vão além do básico.
    </Text>

    <Divider style={{ margin: "0 auto" }} />
  </div>
);

export default HeaderPortfolio;
