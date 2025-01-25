import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useUser } from '@clerk/nextjs';

interface IconProps {
  type: 'university' | 'location' | 'graduation' | 'locked' | 'unlocked' | 'language' | 'link';
  languageCode?: string;
}

interface CourseProps {
  course: {
    _id: string;
    nome: string;
    link: string;
    tipo: string;
    uni: string;
    accesso: string;
    area: string;
    lingua: string;
    comune: string;
  };
}

const LANGUAGE_CODES = {
  English: 'GB',
  Italian: 'IT',
} as const;

const Icon: React.FC<IconProps> = ({ type, languageCode }) => {
  const icons = {
    university: '🏛️',
    location: '📍',
    graduation: '🎓',
    locked: '🔒',
    unlocked: '🔓',
    link: '↗️',
    language: '🌐',
  };

  if (type === 'language' && languageCode) {
    if (languageCode === 'multiply') {
      return (
        <div className="flex">
          <ReactCountryFlag
            countryCode={LANGUAGE_CODES.Italian}
            svg
            className="mr-1"
            style={{ width: '1.25em', height: '1.25em' }}
            title="Italian"
          />
          <ReactCountryFlag
            countryCode={LANGUAGE_CODES.English}
            svg
            className="mr-2"
            style={{ width: '1.25em', height: '1.25em' }}
            title="English"
          />
        </div>
      );
    }
    return (
      <ReactCountryFlag
        countryCode={languageCode}
        svg
        className="mr-2"
        style={{ width: '1.25em', height: '1.25em' }}
        title={`Language: ${languageCode === 'GB' ? 'English' : 'Italian'}`}
      />
    );
  }

  return (
    <span
      className={`mr-2 ${
        type === 'locked' ? 'text-red-600' : type === 'unlocked' ? 'text-green-600' : 'text-gray-600'
      }`}
    >
      {icons[type]}
    </span>
  );
};

const ProgramRow: React.FC<CourseProps> = ({ course }) => {
  const { isSignedIn } = useUser(); // Using useUser hook for client-side user check

  return (
    <div className="group mb-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-5 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md relative">
      {/* Login message inside the card */}
      {!isSignedIn && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 text-sm p-1 rounded-md shadow-md z-10">
          Sign in to view detailed course information
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
        {/* Course Name */}
        {!isSignedIn ? (
          <span className="font-inter text-lg font-semibold text-gray-400 cursor-not-allowed">
            {course.nome}
          </span>
        ) : (
          <a
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter text-lg font-semibold text-indigo-700 decoration-2 hover:text-indigo-800 hover:underline"
          >
            {course.nome}
            <Icon type="link" />
          </a>
        )}

        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
          {/* Icons for Access and Language */}
          <div className={`flex items-center gap-2 ${!isSignedIn ? 'blur-sm' : ''}`}>
            <Icon type={course.accesso === 'Libero' ? 'unlocked' : 'locked'} />
            <Icon
              type="language"
              languageCode={
                course.lingua === 'IT'
                  ? LANGUAGE_CODES.Italian
                  : course.lingua === 'EN'
                  ? LANGUAGE_CODES.English
                  : course.lingua.toLowerCase() === 'più lingue'
                  ? 'multiply'
                  : course.lingua
              }
            />
          </div>

          {/* Location */}
          <div className={`flex items-center text-sm ${!isSignedIn ? 'blur-sm' : 'text-gray-600'}`}>
            <Icon type="location" />
            <span className="font-medium">{course.comune}</span>
          </div>
        </div>
      </div>

      {/* University */}
      <div
        className={`mt-3 flex items-center ${
          !isSignedIn ? 'blur-sm' : 'text-gray-700 font-medium tracking-wide'
        }`}
      >
        <Icon type="university" />
        <span>{course.uni}</span>
      </div>
    </div>
  );
};

export default ProgramRow;
