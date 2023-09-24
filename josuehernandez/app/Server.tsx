import { server } from "@/config";
import fs, { promises as ps } from "fs";
import Educations from "./Educations";

// get educations from the local file
async function getEducations(): Promise<any> {
    if (fs.existsSync("public/content/educations.json")) {
      const res = await ps.readFile("public/content/educations.json", "utf-8");
      const educations: Education[] = JSON.parse(res);
      return educations;
    }
  
    const educations = fetch(`${server}/content/educations.json`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  
    return educations;
  }

export default async function Server({
    component,
  }: {
    component: string;
  }): Promise<JSX.Element>{
    switch (component) {
        case "Educations":
            return <Educations educations={await getEducations()} />;
        default:
            return <></>;
    }
    
}