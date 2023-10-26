"use client"
import AnyApp from '@/app/components/applications/applicationAny';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { NextPage } from 'next';
import Link from 'next/link';


const MentorApp: NextPage = ({ }: any) => {

    function CheckBoxComponent({ label }: { label: string }) {
        const onChange = (e: CheckboxChangeEvent) => {
            console.log(`checked = ${e.target.checked}`);
        };

        return (
            <Checkbox onChange={onChange}>{label}</Checkbox>
        );
    }

    const CustomTab1 = () => (
        <div className='text-sm px-4'>

            <div className="">
                Welcome to the Reality Hack 2024 participant application form. Please fill out this form to apply for a spot at Reality Hack 2024. For all applications-related questions, contact{' '}
                <Link href="mailto:apply@mitrealityhack.com">
                    <span className='text-blue-500'>apply@mitrealityhack.com</span>
                </Link>.
            </div>

            <div className='p-4'>
                For general inquiries, contact <Link href="team@mitrealityhack.com">
                    <span className='text-blue-500'>team@mitrealityhack.com</span>
                </Link>
            </div>


            <div className='p-4'>
                Please note that this form is not a commitment to attend Reality Hack 2024. You will be notified of your acceptance status by email.
            </div>


            <div>
                You will receive a confirmation email when you complete the application submission.
            </div>


            <div className='p-4'>
                All fields are required unless marked as optional.
            </div>
        </div>
    );

    const CustomTab2 = () => (
        <div className="overflow-y-auto">
            <div className='text-xl text-purple-900 font-bold'>Disclaimers</div>
            <div className='flex flex-col gap-4 p-4'>
                <div>

                    We encourage all participants to form new connections with cool creative people that they&apos;ve never worked with before.
                </div>
                <div>

                    Please do not apply as a representative for a group, or plan to attend with the condition that your friends or co-workers are accepted.
                </div>

                <div>

                    More information will be announced in the Rules as we get closer to the event.
                </div>

                <div className='p-4'>

                    <CheckBoxComponent label="I understand and accept the above disclaimer." />

                </div>
                <div className='border border-1 border-gray-200'></div>
                <div>

                    Our participants are literally building the future by making their work available for further development.
                </div>

                <div>

                    Therefore, all projects built during the hackathon will be released under an open source license (see opensource.org).
                </div>

                <div className='p-4'>
                    <CheckBoxComponent label="I understand and accept the above disclaimer." />

                </div>

            </div>
        </div>
    );

    const CustomTab3 = () => (
        <div className="text-lg">Custom Tab 3 Content</div>
    );

    const CustomTab4 = () => (
        <div className="text-lg">Custom Tab 4 Content</div>
    );

    const CustomTab5 = () => (
        <div className="text-lg">Custom Tab 5 Content</div>
    );

    const CustomTab6 = () => (
        <div className="text-lg">Custom Tab 6 Content</div>
    );

    const CustomTab7 = () => (
        <div className="text-lg">Custom Tab 7 Content</div>
    );


    // Define your tabs as an array of components or elements
    const tabs = [
        <CustomTab1 key={0}/>,
        <CustomTab2 key={1}/>,
        <CustomTab3 key={2}/>,
        <CustomTab4 key={3}/>,
        <CustomTab5 key={4}/>,
        <CustomTab6 key={5}/>,
        <CustomTab7 key={6}/>,
    ];


    return (
        <AnyApp 
            key="1"
            tabs={tabs}
            AppType="Mentor"
        />
            

    );
};

export default MentorApp;
