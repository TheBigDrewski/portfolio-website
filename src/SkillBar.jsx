import { motion } from "framer-motion";

export default function SkillBar({ skill, level }) {
  return (
    <div className="mb-4 pt-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">{skill}</span>
        <span className="text-sm font-medium text-gray-400">{level}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-2.5 rounded-full bg-primary-500"
        />
      </div>
    </div>
  );
}
