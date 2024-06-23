import { ConfigProvider } from "antd";
import theme from "../../styles/theme";

const AntdProvider = ({ children }) => {
    return <ConfigProvider theme={theme}>{ children }</ConfigProvider>
}

export default AntdProvider;