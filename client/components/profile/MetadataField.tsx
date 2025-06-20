import React from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

const UserInfoSidebar = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex justify-center items-center h-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const desiredDegreeLevel = user.publicMetadata?.desiredDegreeLevel || 'a degree';
  const academicAreas = user.publicMetadata?.academicAreas;

  // Format academic areas
  let areasText = 'various fields';
  if (Array.isArray(academicAreas) && academicAreas.length > 0) {
    areasText = academicAreas.map(area =>
      typeof area === 'object' && area.name ? area.name : String(area)
    ).join(', ');
  } else if (typeof academicAreas === 'string' && academicAreas.trim()) {
    areasText = academicAreas;
  }

  return (
    <div className="bg-white rounded-2xl  p-4">
      <div className=" text-slate-700">
        Looking for a <span className="font-semibold text-slate-900">{String(desiredDegreeLevel)}</span> in <span className="font-semibold text-slate-900">{String(areasText)}</span>
      </div>
    </div>
  );
};

export default UserInfoSidebar;