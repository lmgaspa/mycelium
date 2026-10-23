import { getRequestConfig } from "next-intl/server";
import pt from "../../messages/pt.json";

// O HTML inicial permanece estático; o LocaleProvider aplica a escolha salva no cliente.
export default getRequestConfig(async () => ({ locale: "pt", messages: pt }));
