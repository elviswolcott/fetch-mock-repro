import fetch from "node-fetch";

const yesno = async (): Promise<{
  answer: string;
  image: string;
  forced: boolean;
}> => {
  const response = await fetch("https://yesno.wtf/api");
  const json = await response.json();
  return json;
};

export { yesno };
