import { ConfigProvider } from "antd";

const AntdProvider = ({ children }) => {
    return <ConfigProvider>{ children }</ConfigProvider>
}

export default ConfigProvider;