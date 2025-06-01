import { getEnvVar } from "@/utils/get-env-var";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: getEnvVar(process.env.OPENAI_API_KEY, "OPENAI_API_KEY"), // This is the default and can be omitted
});

export default client;
