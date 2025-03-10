import { getServerSession } from "next-auth";

import Navcomp from "./navcomp";

const Navbar = async () => {
  const session = await getServerSession();

  return (
    <>
      <Navcomp session={session?.user} />
    </>
  );
};

export default Navbar;
