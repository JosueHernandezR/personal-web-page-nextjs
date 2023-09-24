import { server } from "@/config";
import fs, { promises as ps } from "fs";
import Educations from "./Educations";
import Experiences from "./Experiences";

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

async function getExperiencies(): Promise<any>{
  if(fs.existsSync("public/content/experiences.json")){
    const res = await ps.readFile("public/content/experiences.json", "utf-8");
    const experiences: Experience[] = JSON.parse(res);
    return experiences;
  }

  const experiences = fetch(`${server}/content/experiences.json`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return experiences;
}

export default async function Server({
    component,
  }: {
    component: string;
  }): Promise<JSX.Element>{
    switch (component) {
        case "Educations":
            return <Educations educations={await getEducations()} />;
        case "Experiences":
            return <Experiences experiences={await getExperiencies()}/>
        default:
            return <></>;
    }
    
}