import Loader from '@/components/Loader';

export function EventPanelLoader(): JSX.Element {
  return <Loader />;
}

export function EventPanelError({ message }: { message: string }): JSX.Element {
  return <div className="pb-8 text-red-600">{message}</div>;
}

export function EventPanelEmpty({ message }: { message: string }): JSX.Element {
  return <div className="pb-8 text-gray-600">{message}</div>;
}
