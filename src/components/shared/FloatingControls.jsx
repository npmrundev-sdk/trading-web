"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/lib/firebase";
import { Facebook, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export const FloatingControls = () => {
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: "",
    facebookPage: "",
    telegram: "",
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const docRef = doc(db, "siteSettings", "general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setSocialLinks({
            whatsapp: data.socialLinks?.whatsapp || "",
            facebookPage: data.socialLinks?.facebookPage || "",
            telegram: data.socialLinks?.telegram || "",
          });
        }
      } catch (error) {
        console.error("Failed to load social links:", error);
      }
    };

    fetchSocialLinks();
  }, []);

  const buttons = [
    {
      name: "WhatsApp",
      url: socialLinks.whatsapp,
      icon: <FaWhatsapp className="text-white text-xl sm:text-2xl" />,
      color: "bg-[#25d366]",
    },
    {
      name: "Facebook",
      url: socialLinks.facebookPage,
      icon: <Facebook className="text-white w-5 h-5 sm:w-6 sm:h-6" />,
      color: "bg-[#1877f2]",
    },
    {
      name: "Telegram",
      url: socialLinks.telegram,
      icon: <Send className="text-white w-4 h-4 sm:w-5 sm:h-5" />,
      color: "bg-[#0088cc]",
    },
  ];

  return (
    <div className="fixed right-3 sm:right-4 bottom-32 md:bottom-20 sm:bottom-24 z-40 flex flex-col gap-2 sm:gap-3">
      {buttons.map(
        (button) =>
          button.url && (
            <a
              key={button.name}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={button.name}
              title={button.name}
              className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full ${button.color} flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
            >
              {button.icon}
            </a>
          )
      )}
    </div>
  );
};