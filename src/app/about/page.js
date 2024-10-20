"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CodingAnimation = () => {
  const [text, setText] = useState("");
  const fullText =
    'const aboutChloe = { passion: "coding", origin: "South Korea", pets: ["Cat 1", "Cat 2"] };';

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-green-400 font-mono overflow-x-auto">
      <pre className="whitespace-pre-wrap break-words">{text}</pre>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 sm:py-12 md:py-10 lg:px-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            안녕하세요! I'm Chloe Yeo
          </h1>
          <p className="text-lg sm:text-xl">
            Software Engineer | Cat Lover | Hackathon Enthusiast
          </p>
        </motion.div>

        <div className="space-y-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p>
              Born and raised in South Korea, I'm now based in Glasgow City, UK,
              pursuing my passion for software engineering. When I'm not coding,
              you'll find me cuddling with my two adorable cats or brainstorming
              ideas for the next hackathon!
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">My Coding Journey</h2>
            <CodingAnimation />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">
            My Feline Companions
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <CatImage
              name="Chunsa"
              koreanName="천사"
              imageSrc="/images/chunsa.png"
            />
            <CatImage
              name="Toto"
              koreanName="토토"
              imageSrc="/images/toto.jpg"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold mb-6">Let's Connect!</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                href: "https://www.linkedin.com/in/chloe-yeo-5aa15b1ab/",
                label: "LinkedIn",
              },
              {
                href: "https://www.youtube.com/@chloeyeocodes",
                label: "YouTube",
              },
              { href: "https://github.com/chloeyeo", label: "GitHub" },
              { href: "https://leetcode.com/u/ylbedit/", label: "LeetCode" },
              {
                href: "https://www.hackerrank.com/profile/yeochloe01",
                label: "HackerRank",
              },
            ].map((link) => (
              <motion.div
                key={link.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-full transition duration-300 hover:bg-purple-100"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
          <h3 className="text-3xl font-semibold mt-10 mb-4">View My CV</h3>
          <Link
            href="https://drive.google.com/file/d/14uYuTilPbkZFDQQcc2AW7pltbNSGcYNo/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold mt-10 py-2 px-4 rounded"
          >
            CV
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function CatImage({ name, koreanName, imageSrc }) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} className="text-center">
      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-purple-100 bg-opacity-50 rounded-full mb-4 overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={name}
            width={160}
            height={160}
            className="max-w-none max-h-none"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
      <p>{name}</p>
      <p>{koreanName}</p>
    </motion.div>
  );
}
