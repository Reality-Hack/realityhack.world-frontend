import { useEffect, useRef } from 'react';

type ModalProps = {
  toggleOverlay: () => void;
  children: React.ReactNode;
};

export default function Modal({ toggleOverlay, children }: ModalProps) {
  const closeModal = () => {
    toggleOverlay();
  };

  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalContainerRef.current &&
        !modalContainerRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20 z-[1000]">
      <div
        ref={modalContainerRef}
        className="relative flex flex-col items-center w-1/2 min-w-[700px] bg-white rounded-lg h-3/4 "
      >
        <div
          onClick={closeModal}
          className="absolute p-2 mr-4 border-gray-200 rounded-full hover:cursor-pointer top-2 right-2"
        >
          X
        </div>
        <div className="flex-1 w-full pr-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
