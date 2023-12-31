import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface FeatureFlags {
  [key: string]: boolean;
}

const useFeatureFlags = () => {
  const router = useRouter();
  const pathname = usePathname();

  console.log('router', router);

  const areFeatureFlagsDefined = !!process.env.NEXT_PUBLIC_FEATURE_FLAGS;

  const featureFlags: FeatureFlags = process.env.NEXT_PUBLIC_FEATURE_FLAGS
    ? JSON.parse(process.env.NEXT_PUBLIC_FEATURE_FLAGS)
    : {};

  useEffect(() => {
    const featureFlagKey = pathname.substring(1);
    if (featureFlags[featureFlagKey] === false) {
      router.replace('/');
    }
  }, [router, pathname, featureFlags]);

  const isFeatureEnabled = (href: string): boolean => {
    return areFeatureFlagsDefined
      ? featureFlags[href.substring(1)] !== false
      : true;
  };

  return { isFeatureEnabled, areFeatureFlagsDefined };
};

export default useFeatureFlags;
