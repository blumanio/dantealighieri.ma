import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Image from "next/image";

type Country = "morocco" | "algeria" | "tunisia" | "egypt";

type Counselor = {
  name: string;
  role: string;
  premium: boolean;
  country: Country;
  locked: boolean;
};

const counselors: Counselor[] = [
  {
    name: "Kamalakannan S",
    role: "Lead Counsellor",
    premium: true,
    country: "morocco",
    locked: true,
  },
  {
    name: "Jemini Ganatra",
    role: "Lead Counsellor",
    premium: true,
    country: "algeria",
    locked: true,
  },
  {
    name: "Preethi G.",
    role: "Lead Counsellor",
    premium: true,
    country: "tunisia",
    locked: true,
  },
  {
    name: "Akhila Prabha",
    role: "Senior Counsellor",
    premium: false,
    country: "egypt",
    locked: true,
  },
  {
    name: "Syed S. Qadri",
    role: "Senior Counsellor",
    premium: false,
    country: "morocco",
    locked: true,
  },
];

const flagMap: Record<Country, string> = {
  morocco: "/flags/morocco.png",
  algeria: "/flags/algeria.png",
  tunisia: "/flags/tunisia.png",
  egypt: "/flags/egypt.png",
};

export default function MyCounselors() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-2 text-center sm:text-left">
        Your Counselors
      </h2>
      <p className="text-sm text-muted-foreground text-center sm:text-left mb-6">
        Unlock your personalized team of expert study abroad advisors
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {counselors.map((counselor, idx) => (
          <Card key={idx} className="text-center p-2 rounded-2xl shadow-md">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                <Lock className="text-muted-foreground w-6 h-6" />
              </div>
            </div>
            <CardContent>
              <div className="flex justify-center gap-1 items-center mb-1">
                <Image
                  src={flagMap[counselor.country]}
                  alt={counselor.country}
                  width={20}
                  height={15}
                />
                <span className="text-sm font-medium">
                  {counselor.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {counselor.role}
              </p>
              {counselor.premium && (
                <Badge className="text-xs" variant="default">
                  Premium
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm">
          Our team includes <span className="text-primary font-semibold">60+ Ivy League counselors</span> ready to help!
        </p>
        <Button className="mt-4">Let’s Get Started</Button>
      </div>
    </div>
  );
}
