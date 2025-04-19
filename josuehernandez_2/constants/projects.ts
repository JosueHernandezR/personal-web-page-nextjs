import { Project } from "@/types";

export const projects: Project[] = [
    {
        title: "title_1",
        description: "description_1",
        link: {
            "href": "https://github.com/JosueHernandezR/hackaton-itam-2023-blockchain",
            "label": "Team INSOMNIA"
        },
        logo: {
            "src": "/images/robonomics.png",
            "alt": "Web3"
        },
    },
    {
        title: "title_2",
        description: "description_2",
        link: {
            "href": "https://traduccion-project.vercel.app/",
            "label": "Translate Service 'Del Campo Capital Humano'"
          },
        logo: {
            "src": "/images/logo_1.png",
            "alt": "People"
          },
    },
    {
        title: "title_3",
        description: "description_3",
        link: {
            "href": "https://aitulum.com",
            "label": "Official Page for Airport International of Tulum."
        },
        logo: {
            "src": "/images/tulum.png",
            "alt": "Logo for Airport International of Tulum"
        },
    }
]