import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { experience } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";

export default function ExperiencePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Experience
          </h2>
          <p className="mt-4 text-zinc-400">
            My professional journey and education.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        {/* Work Experience */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-zinc-100 font-display">Work</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {experience.map((exp) => (
              <Card key={exp.company}>
                <article className="p-4 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-12 h-12 rounded-lg object-contain bg-zinc-800 p-1"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-zinc-100 font-display">
                        {exp.company}
                      </h4>
                      <p className="text-sm text-zinc-400">{exp.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-sm text-zinc-400">{exp.description}</p>
                </article>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-zinc-800" />

        {/* Certifications */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-zinc-100 font-display">Certifications</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {certifications.map((cert) => (
              <Card key={cert.institution}>
                <article className="p-4 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={cert.logo}
                      alt={cert.institution}
                      className="w-12 h-12 rounded-lg object-contain bg-zinc-800 p-1"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-zinc-100 font-display">
                        {cert.institution}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-200 mb-1">{cert.program}</p>
                  <p className="text-xs text-zinc-500">
                    {cert.startDate} - {cert.endDate}
                  </p>
                </article>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-zinc-800" />

        {/* Education */}
        <div className="space-y-8 pb-16">
          <h3 className="text-2xl font-bold text-zinc-100 font-display">Education</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {education.map((edu) => (
              <Card key={edu.institution}>
                <article className="p-4 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={edu.logo}
                      alt={edu.institution}
                      className="w-12 h-12 rounded-lg object-contain bg-zinc-800 p-1"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-zinc-100 font-display">
                        {edu.institution}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-200 mb-1">{edu.program}</p>
                  <p className="text-xs text-zinc-500">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </article>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
