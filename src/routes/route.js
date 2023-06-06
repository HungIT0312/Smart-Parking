import { TbLicense } from "react-icons/tb";
import { MdOutlineLocalParking } from "react-icons/md";
import { RiGroupLine } from "react-icons/ri";
import { AiOutlineFieldTime } from "react-icons/ai";
const routeConf = [
  {
    name: "License",
    to: "/Manager/License",
    icon: <TbLicense color="#000" size={30} />,
  },
  {
    name: "Parking",
    to: "/Manager/Parking",
    icon: <MdOutlineLocalParking color="#000" size={30} />,
  },
  {
    name: "Clients",
    to: "/Manager/Clients",
    icon: <RiGroupLine color="#000" size={30} />,
  },
  {
    name: "TimeLog",
    to: "/Manager/TimeLog",
    icon: <AiOutlineFieldTime color="#000" size={30} />,
  },
];
const clientRoute = [
  {
    name: "Parking",
    to: "/Client/Parking",
  },
  {
    name: "Profile",
    to: "/Client/Profile",
  },
  {
    name: "Vehicle",
    to: "/Client/Vehicle",
  },
];
export { routeConf };
export { clientRoute };
