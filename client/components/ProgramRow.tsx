import React from 'react';
import ReactCountryFlag from 'react-country-flag';

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
  }
}

const LANGUAGE_CODES = {
  English: 'GB',
  Italian: 'IT',
} as const;

const Icon: React.FC<IconProps> = ({ type, languageCode }) => {
  interface Icons {
    university: string;
    location: string;
    graduation: string;
    locked: string;
    unlocked: string;
    link: string;
    language: string;
   }
  const icons:Icons = {
    university: '🏛️',
    location: '📍',
    graduation: '🎓',
    locked: '🔒',
    unlocked: '🔓',
    link: '↗️',
    language: '🌐',
  };

  if (type === 'language' && languageCode) {
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
    <span className={`mr-2 ${type === 'locked' ? 'text-red-600' : type === 'unlocked' ? 'text-green-600' : 'text-gray-600'}`}>
      {icons[type]}
    </span>
  );
};

const ProgramRow: React.FC<CourseProps> = ({ course }) => (
  <div className="group mb-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-5 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md">
    <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
      <a
        href={course.link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-inter text-lg font-semibold text-indigo-700 decoration-2 hover:text-indigo-800 hover:underline"
      >
        {course.nome}
      </a>
      
      <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Icon 
            type={course.accesso === 'Libero' ? 'unlocked' : 'locked'} 
          />
          <Icon 
            type="language" 
            languageCode={course.lingua === "IT" ? LANGUAGE_CODES.Italian : LANGUAGE_CODES.English} 
          />
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Icon type="location" />
          <span className="font-medium">{course.comune}</span>
        </div>
      </div>
    </div>

    <div className="mt-3 flex items-center">
      <Icon type="university" />
      <span className="text-sm text-gray-700 font-medium tracking-wide">{course.uni}</span>
    </div>
  </div>
);

export default ProgramRow;