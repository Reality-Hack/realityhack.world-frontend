'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import './profile.css';
export default function RoundOne() {
  const { data: session, status } = useSession();
  const { user } = useAuth();
  {/*Variable Initialization for Destiny Profile: Basic Info, About Me, Current Project, Social Links*/}
  const [basicInfo, setBasicInfo] = useState({
    name: 'Alex Johnson',
    title: 'Full Stack Developer & UX Enthusiast',
    email: 'alex@example.com',
    discord: '@alexj'
  });

  const [aboutMe, setAboutMe] = useState({
    bio: 'Passionate about creating intuitive user experiences and scalable backend solutions. Always excited to learn new technologies and collaborate on innovative projects.',
    specialties: 'React, Node.js, Python, UI/UX Design, GraphQL, AWS',
    interests: 'AI/ML, IoT, Blockchain, Sustainable Tech'
  });

  const [currentProject, setCurrentProject] = useState(
    'Working on EcoTrack: An AI-powered app to help individuals and businesses reduce their carbon footprint through personalized recommendations and community challenges.'
  );

  const [socialLinks, setSocialLinks] = useState({
    github: 'https://github.com/alexj',
    linkedin: 'https://linkedin.com/in/alexj',
    twitter: 'https://twitter.com/alexj',
    personalWebsite: 'https://alexj.dev',
    showSocialLinks: true
  });

  // Initialize state with 'standard' as the default selected option
  const [selectedOption, setSelectedOption] = useState('Standard');
  const [profileCustomization, setProfileCustomization] = useState({
    theme: 'Light'
  });
  
  
  {/*Variable Initialization for Communication*/}
  const [communication, setCommunicationMedium] = useState({
    name: basicInfo.name,
    phone: '123-456-7890',
    email: basicInfo.email,
    communicationMedium: '',
    responseTimes: '',
    directness: ''
  });

  {/*Handle change events when a radio button is selected*/}
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value); // Update selected option based on radio button value
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: string,
    field: string
  ) => {
    if (section === 'basicInfo') {
      setBasicInfo({ ...basicInfo, [field]: e.target.value });
    } else if (section === 'aboutMe') {
      setAboutMe({ ...aboutMe, [field]: e.target.value });
    } else if (section === 'socialLinks') {
      setSocialLinks({ ...socialLinks, [field]: e.target.value });
    } else if (section === 'profileCustomization') {
      setProfileCustomization({
        ...profileCustomization,
        [field]: e.target.value
      });
    }
  };

  const handleToggle = (section: string, field: string) => {
    if (section === 'socialLinks') {
      setSocialLinks({
        ...socialLinks,
        [field]: !socialLinks[field as keyof typeof socialLinks]
      });
    }
  };
  return (
    <div className="flex flex-col gap-2">
      {status === 'loading' && <Loader />}
      {status === 'authenticated' && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-1 flex-grow">
          <div>
            <div className="mx-auto h-2 bg-[#4D97E8] rounded-t-lg" />
            {/*Destiny Profile Form, featuring: Basic Info, About Me, Current Project, Social Links, Profile Customization, Preview*/}
            <div className="container-fluid ml-0 mr-0 py-5 md:ml-20 md:mr-20">
              <h1 className="text-center text-xl font-bold mb-4">
                Create Your Destiny Profile
              </h1>
              <form>
                <div className="flex flex-col gap-8 justify-evenly md:flex-row md:ml-20 md:mr-20">
                  <div className="flex flex-col w-full justify-between gap-6">
                    {/* Basic Information */}
                    <section className="card shadow p-4 rounded-md">
                      <h2 className="text-xl font-bold mb-4">
                        Basic Information
                      </h2>
                      <div className="mb-3">
                        <label htmlFor="name" className="block font-medium">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full border rounded-md p-2"
                          value={basicInfo.name}
                          onChange={e =>
                            handleInputChange(e, 'basicInfo', 'name')
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="title" className="block font-medium">
                          Professional Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="w-full border rounded-md p-2"
                          value={basicInfo.title}
                          onChange={e =>
                            handleInputChange(e, 'basicInfo', 'title')
                          }
                        />
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="flex-grow">
                          <label htmlFor="email" className="block font-medium">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="w-full border rounded-md p-2"
                            value={basicInfo.email}
                            onChange={e =>
                              handleInputChange(e, 'basicInfo', 'email')
                            }
                          />
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              id="toggleEmail"
                              className="peer hidden"
                              defaultChecked
                            />
                            <span className="relative top-3 block w-full h-full bg-gray-400 rounded-full cursor-pointer peer-checked:bg-black"></span>
                            <span className="absolute left-1 top-4 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6 peer-unchecked:translate-x-0"></span>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-grow">
                          <label
                            htmlFor="discord"
                            className="block font-medium"
                          >
                            Discord
                          </label>
                          <input
                            type="text"
                            id="discord"
                            className="w-full border rounded-md p-2"
                            value={basicInfo.discord}
                            onChange={e =>
                              handleInputChange(e, 'basicInfo', 'discord')
                            }
                          />
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              id="toggleDiscord"
                              className="peer hidden"
                              defaultChecked
                            />
                            <span className="relative top-3 block w-full h-full bg-gray-400 rounded-full cursor-pointer peer-checked:bg-black"></span>
                            <span className="absolute left-1 top-4 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6 peer-unchecked:translate-x-0"></span>
                          </label>
                        </div>
                      </div>
                    </section>

                    {/* About Me */}
                    <section className="card shadow p-4 rounded-md">
                      <h2 className="text-xl font-bold mb-4">About Me</h2>
                      <div className="mb-3">
                        <label htmlFor="bio" className="block font-medium">
                          Bio
                        </label>
                        <div className="flex justify-between gap-4">
                          <textarea
                            className="scrollbar-custom border rounded-md p-2 overflow-y-scroll w-full"
                            rows={4}
                            cols={37}
                            value={aboutMe.bio}
                            onChange={e =>
                              handleInputChange(e, 'aboutMe', 'bio')
                            }
                          />
                          <div>
                            <label className="relative inline-block top-9 w-12 h-6">
                              <input
                                type="checkbox"
                                id="toggleSocial"
                                className="peer hidden"
                                defaultChecked
                              />
                              <span className="relative top-2 block w-full h-full bg-gray-400 rounded-full cursor-pointer peer-checked:bg-black"></span>
                              <span className="absolute left-1 top-3 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6 peer-unchecked:translate-x-0"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="specialties"
                          className="block font-medium"
                        >
                          Specialties (comma-separated)
                        </label>
                        <div className="flex justify-between gap-4">
                          <input
                            type="text"
                            id="specialties"
                            className="w-full border rounded-md p-2"
                            value={aboutMe.specialties}
                            onChange={e =>
                              handleInputChange(e, 'aboutMe', 'specialties')
                            }
                          />
                          <div>
                            <label className="relative inline-block top-0 w-12 h-6">
                              <input
                                type="checkbox"
                                id="toggleSocial"
                                className="peer hidden"
                                defaultChecked
                              />
                              <span className="relative top-2 block w-full h-full bg-gray-400 rounded-full cursor-pointer peer-checked:bg-black"></span>
                              <span className="absolute left-1 top-3 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6 peer-unchecked:translate-x-0"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="interests"
                          className="block font-medium"
                        >
                          Interests (comma-separated)
                        </label>
                        <div className="flex justify-between gap-4">
                          <input
                            type="text"
                            id="interests"
                            className="w-full border rounded-md p-2"
                            value={aboutMe.interests}
                            onChange={e =>
                              handleInputChange(e, 'aboutMe', 'interests')
                            }
                          />
                          <div>
                            <label className="relative inline-block top-0 w-12 h-6">
                              <input
                                type="checkbox"
                                id="toggleSocial"
                                className="peer hidden"
                                defaultChecked
                              />
                              <span className="relative top-2 block w-full h-full bg-gray-400 rounded-full cursor-pointer peer-checked:bg-black"></span>
                              <span className="absolute left-1 top-3 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6 peer-unchecked:translate-x-0"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Current Project */}
                    <section className="card shadow p-4 rounded-md">
                      <h2 className="text-xl font-bold mb-4">
                        Current Project
                      </h2>
                      <div className="flex justify-between gap-4">
                        <textarea
                          className="scrollbar-custom border rounded-md p-2 overflow-y-scroll w-full"
                          rows={4}
                          cols={37}
                          value={currentProject}
                          onChange={e => setCurrentProject(e.target.value)}
                        ></textarea>
                        <div>
                          <label className="relative inline-block top-9 w-12 h-6">
                            <input
                              type="checkbox"
                              id="toggleSocial"
                              className="peer hidden"
                              defaultChecked
                            />
                            <span className="relative top-2 block w-full h-full bg-gray-400 rounded-full cursor-pointer peer-checked:bg-black"></span>
                            <span className="absolute left-1 top-3 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6 peer-unchecked:translate-x-0"></span>
                          </label>
                        </div>
                      </div>
                    </section>

                    {/* Social Links */}
                    <section className="card shadow p-4 rounded-md">
                      <h2 className="text-xl font-bold mb-4">Social Links</h2>
                      {Object.entries(socialLinks).map(([key, value]) => {
                        if (key === 'showSocialLinks') return null; // Skip the toggle
                        return (
                          <div className="mb-3" key={key}>
                            <label htmlFor={key} className="block font-medium">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <input
                              type="text"
                              id={key}
                              className="w-full border rounded-md p-2"
                              value={value as string}
                              onChange={e =>
                                handleInputChange(e, 'socialLinks', key)
                              }
                            />
                          </div>
                        );
                      })}
                      <div className="relative right-100">
                        <label htmlFor="showSocialLinks" className="ml-2">
                          Show Social Links
                        </label>
                        &nbsp;
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            id="toggleSocial"
                            className="peer hidden"
                            defaultChecked
                          />
                          <span className="relative top-2 block w-full h-full bg-gray-400 rounded-full cursor-pointer peer-checked:bg-black"></span>
                          <span className="absolute left-1 top-3 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6 peer-unchecked:translate-x-0"></span>
                        </label>
                      </div>
                    </section>
                  </div>

                  <div className="flex flex-col w-full justify-content gap-6">
                    {/*Profile Customization*/}
                    <section className="card shadow p-4 rounded-md">
                      <h2 className="text-xl font-bold mb-4">
                        Profile Customization
                      </h2>
                      <div className="mb-5">
                        <label htmlFor="layout" className="block font-medium">
                          Layout
                        </label>
                        <div className="flex mb-1 gap-2">
                          <input
                            type="radio"
                            id="standard"
                            name="layout"
                            value="Standard"
                            checked={selectedOption === 'Standard'}
                            onChange={handleRadioChange}
                            className="border rounded-md p-2 accent-black"
                          />
                          <label htmlFor="standard">Standard</label>
                        </div>
                        <div className="flex mb-1 gap-2">
                          <input
                            type="radio"
                            id="compact"
                            name="layout"
                            value="Compact"
                            checked={selectedOption === 'Compact'} // Check if 'Standard' is selected
                            onChange={handleRadioChange}
                            className="border rounded-md p-2 accent-black"
                          />
                          <label htmlFor="compact">Compact</label>
                        </div>
                        <div className="flex mb-1 gap-2">
                          <input
                            type="radio"
                            id="expanded"
                            name="layout"
                            value="Expanded"
                            checked={selectedOption === 'Expanded'} // Check if 'Standard' is selected
                            onChange={handleRadioChange}
                            className="border rounded-md p-2 accent-black"
                          />
                          <label htmlFor="expanded">Expanded</label>
                        </div>
                      </div>

                      <div className="mb-5">
                        <label htmlFor="theme" className="block font-medium">
                          Theme
                        </label>
                        <select
                          id="theme"
                          name="theme"
                          className="border rounded-md p-2 w-full outline-none"
                        >
                          <option value="Light">Light</option>
                          <option value="Dark">Dark</option>
                        </select>
                      </div>
                    </section>

                    {/* Profile Preview */}
                    <section className="card shadow p-4 rounded-md">
                      <h2 className="text-xl font-bold mb-6">
                        Profile Preview
                      </h2>
                      <div className="text-center">
                        <h2 className="text-xl font-bold">{basicInfo.name}</h2>
                        <p className="mb-4">{basicInfo.title}</p>
                        <div>
                          <div className="inline-flex items-center gap-2 mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                              />
                            </svg>
                            <span>{basicInfo.email}</span>
                          </div>
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-2 mb-4">
                            <svg
                              style={{
                                width: '16px',
                                height: '16px',
                                fill: '#000000'
                              }}
                              viewBox="0 0 512 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              {/* Font Awesome Free 6.4.2 by @fontawesome */}
                              <path d="M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path>
                            </svg>
                            <span>{basicInfo.discord}</span>
                          </div>
                        </div>
                        <p className="mb-4">{aboutMe.bio}</p>
                        <div className="mb-4">
                          {aboutMe.specialties.split(',').map(spec => (
                            <span
                              key={spec}
                              className="inline-block bg-gray-100 text-xs font-semibold text-black-800 rounded px-3 py-1 m-1 rounded-xl"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                        <div className="mb-4">
                          {aboutMe.interests.split(',').map(interest => (
                            <span
                              key={interest}
                              className="inline-block border gray-800 text-xs font-semibold text-black-800 rounded px-3 py-1 m-1 rounded-xl"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                        <div className="mb-4">
                          <p className="font-bold">Current Project</p>
                          <p className="mb-4">{currentProject}</p>
                        </div>
                      </div>

                      <div className="imb-4 text-center flex justify-center gap-2 mb-6">
                        <a href={socialLinks.github}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="black"
                            strokeWidth="30"
                            viewBox="0 0 496 512"
                            className="w-8 h-8 border gray-800 p-2"
                          >
                            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                          </svg>
                        </a>
                        <a href={socialLinks.linkedin}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="black"
                            strokeWidth="30"
                            viewBox="0 0 496 512"
                            className="w-8 h-8 border gray-800 p-2"
                          >
                            <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                          </svg>
                        </a>
                        <a href={socialLinks.twitter}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="black"
                            strokeWidth="30"
                            viewBox="0 0 496 512"
                            className="w-8 h-8 border gray-800 p-2"
                          >
                            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                          </svg>
                        </a>
                        <a href={socialLinks.personalWebsite}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="black"
                            viewBox="0 0 24 24"
                            className="w-8 h-8 border gray-800 p-1"
                          >
                            <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                          </svg>
                        </a>
                      </div>
                    </section>

                    <button
                      className="bg-black text-white w-full font-bold p-3 rounded-md"
                      type="submit"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/*Communication Medium Form, featuring Preferecens and Preview*/}
            <div className="container-fluid ml-0 mr-0 py-5 md:ml-20 md:mr-20">
              <h1 className="text-center text-xl font-bold mb-4">
                The best way to communicate with me during the hackathon is...
              </h1>
              <div className="flex flex-col gap-8 justify-evenly md:flex-row md:ml-20 md:mr-20">
                {/*COMMUNICATION PROFILE DIV*/}
                <div className="flex flex-col w-full justify-content gap-6">
                  {/* Edit Your Profile */}
                  <section className="card shadow p-4 rounded-md">
                    <form>
                      <h2 className="text-sm font-bold mb-4">
                        Edit Your Profile
                      </h2>
                      <div className="mb-3">
                        <label
                          htmlFor="name"
                          className="text-xs block font-medium"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full border rounded-md p-2"
                          value={communication.name}
                          onChange={e =>
                            handleInputChange(e, 'communication', 'name')
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="title"
                          className="text-xs block font-medium"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full border rounded-md p-2"
                          value={communication.phone}
                          onChange={e =>
                            handleInputChange(e, 'communication', 'phone')
                          }
                        />
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="flex-grow">
                          <label
                            htmlFor="email"
                            className="text-xs block font-medium"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="w-full border rounded-md p-2"
                            value={communication.email}
                            onChange={e =>
                              handleInputChange(e, 'communication', 'email')
                            }
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <label
                          htmlFor="communicationMedium"
                          className="text-xs block font-medium"
                        >
                          Personal Communication Medium
                        </label>
                        <textarea
                          id="communicationMedium"
                          placeholder="How do you prefer your teammates to communication with you?"
                          className="text-xs w-full border rounded-md p-2"
                          rows={4}
                          onChange={e =>
                            handleInputChange(
                              e,
                              'communication',
                              'communicationMedium'
                            )
                          }
                        />
                      </div>
                      <div className="flex-grow">
                        <label
                          htmlFor="responseTimes"
                          className="text-xs block font-medium"
                        >
                          Response Times
                        </label>
                        <textarea
                          id="responseTimes"
                          placeholder="When do you typically respond to messages?"
                          className="text-xs w-full border rounded-md p-2"
                          rows={4}
                          onChange={e =>
                            handleInputChange(
                              e,
                              'communication',
                              'responseTimes'
                            )
                          }
                        />
                      </div>
                      <div className="flex-grow">
                        <label
                          htmlFor="directness"
                          className="text-xs block font-medium"
                        >
                          Directness
                        </label>
                        <textarea
                          id="directness"
                          placeholder="Do you prefer direct communication or a more nuanced approach?"
                          className="text-xs w-full text-xs border rounded-md p-2"
                          rows={4}
                          onChange={e =>
                            handleInputChange(e, 'communication', 'directness')
                          }
                        />
                      </div>
                      <button
                        className="bg-black text-xs text-white font-bold p-3 rounded-md"
                        type="submit"
                      >
                        Add Custom Field
                      </button>
                    </form>
                  </section>
                </div>
                {/*PREVIEW SECTION DIV*/} 
                <div className="flex flex-col w-full">
                  {/* Preview */}
                  <section className="card shadow p-4 rounded-md mb-3">
                    <h1 className="text-sm font-bold mb-6">
                      The best to communicate with me during the hackathon is...
                    </h1>
                    <div className="text-left">
                      <div className="mb-4">
                        <h6 className=" font-bold">Name</h6>
                        <p>{communication.name}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className=" font-bold">Phone</h6>
                        <p>{communication.phone}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className=" font-bold">Email</h6>
                        <p>{communication.email}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className=" font-bold">
                          Preferred Communication Medium
                        </h6>
                        <p>{communication.communicationMedium}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className=" font-bold">Response Times</h6>
                        <p>{communication.responseTimes}</p>
                      </div>
                      <div className="mb-4">
                        <h6 className=" font-bold">Directness</h6>
                        <p>{communication.directness}</p>
                      </div>
                    </div>
                  </section>
                  <div className="flex-inline">
                    <button className="bg-black text-xs text-white font-bold p-3 rounded-md mr-2">
                      Share Profile
                    </button>
                    <button className="bg-black text-xs text-white font-bold p-3 rounded-md">
                      Export as PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
