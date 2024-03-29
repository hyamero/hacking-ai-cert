import { FormEventHandler, useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import localFont from "next/font/local";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { toast } from "sonner";
import Image from "next/image";

import { db } from "@/config/firebase";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import mainBg from "../../public/images/main-bg.png";

const googleMedium = localFont({
  src: "../../public/fonts/Google-Sans-Medium.ttf",
  display: "swap",
  weight: "600",
  // variable: "--font-google-bold",
});

export default function Home() {
  const { push } = useRouter();

  const [warnModal, setWarnModal] = useState(false);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.match(/FBAN|FBAV/i)) {
      setWarnModal(true);
    }
  }, []);

  const handleLocate: FormEventHandler = async (e) => {
    e.preventDefault();

    const q = query(
      collection(db, "certificates/hacking-ai/for"),
      where("email", "==", email),
      limit(1)
    );

    try {
      setLoading(true);
      const querySnapshot = await getDocs(q);
      let message = "⚠️ No certificate found";

      querySnapshot.forEach((doc) => {
        if (doc.data().email) {
          push(`/cert/${doc.id}`);
          message = "✅ Certificate found!";
          return;
        }
      });

      toast(message);
      setLoading(false);
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="h-screen pt-10 lg:pt-20 relative font-google-reg bg-black flex justify-center items-center">
      <Navbar />
      <Modal
        title="In-app browser detected"
        description="To avoid running into issues, we recommend opening the certificate generator in an external browser."
        isOpen={warnModal}
        handleConfirm={{
          text: "Understood",
          fn: () => setWarnModal(false),
        }}
        onClose={() => null}
      />

      <Image
        src={mainBg}
        priority
        alt="Background image"
        className="absolute top-0 left-0 z-0 object-cover w-full h-full object-center"
      />

      <div className="glassmorph bottom-12 border-2 rounded-[3rem] border-white/25 max-w-screen-sm z-30 relative p-12 mx-auto inline-block">
        <div className="text-white space-y-2 text-center border-b border-white/20 pb-5">
          <h1 className="text-5xl font-bold">Hacking AI</h1>
          <p className=" text-xl">Chatbots for Daily Use</p>
        </div>

        <form
          onSubmit={handleLocate}
          className="flex flex-col gap-2 pt-5  w-full sm:max-w-[400px] max-w-[350px] text-black"
        >
          <p className="text-white/75 font-normal text-center">
            Kindly fill in to claim certificate
          </p>
          <Input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className="rounded-full pl-5 py-2 border-gray-700/75 border-[1.5px]"
          />

          <Button
            type="submit"
            disabled={loading}
            className={`text-white mx-auto ${googleMedium.className}`}
          >
            Claim Certificate
          </Button>
        </form>
      </div>
      {/* <Footer /> */}
    </section>
  );
}
