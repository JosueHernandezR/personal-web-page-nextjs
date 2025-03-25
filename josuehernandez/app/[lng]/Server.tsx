import Educations from './Educations';
import Experiences from './Experiences';

interface ServerProps {
  component: string;
  params: { lng: string };
}

export default function Server({ component, params }: ServerProps): JSX.Element {
  const { lng } = params;

  switch (component) {
    case "Educations":
      return <Educations lng={lng} />;
    case "Experiences":
      return <Experiences lng={lng} />;
    default:
      return <></>;
  }
}