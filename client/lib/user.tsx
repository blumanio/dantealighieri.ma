import { currentUser } from "@clerk/nextjs/server";

export async function isOnboardingComplete(): Promise<boolean> {
    const user = await currentUser();
    console.log('OnboardingPage lang:', user?.publicMetadata);
    // if (!user) {
    //     redirect(`/${lang}/sign-in`);
    // }
    // console.log('OnboardingPage user:', user.publicMetadata);
    // const onboardingComplete =
    //     typeof user.publicMetadata === 'object' &&
    //         user.publicMetadata !== null &&
    //         'onboardingComplete' in user.publicMetadata
    //         ? (user.publicMetadata as { onboardingComplete?: boolean }).onboardingComplete
    //         : false;


    return !!user?.publicMetadata?.onboardingComplete;
}