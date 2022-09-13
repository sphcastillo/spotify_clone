import Center from '../components/Center';
import Sidebar from '../components/Sidebar';
import { getSession, useSession } from "next-auth/react";
import Player from '../components/Player';

export default function Home() {

  const  { data: session, status } = useSession();
  return (

    <div className="bg-black h-screen overflow-hidden">

      <main className="flex">
          <Sidebar />
          <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>

    </div>
  );
}

export async function getServerSideProps(context){
  const session = await getSession(context);

  return {
    props: {
      session
    }
  }
}

