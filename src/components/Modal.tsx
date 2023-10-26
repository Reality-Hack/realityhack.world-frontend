import { useEffect, useRef } from "react";

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
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20">
      <div ref={modalContainerRef} className="relative flex flex-col items-center bg-white rounded-lg h-3/4 w-1/2">
        <div className="absolute top-2 right-2">
          <div
            onClick={closeModal}
            className="border border-2 border-gray-200 p-2 mr-4 hover:bg-gray-700 hover:text-white hover:cursor-pointer rounded-full"
          >
            X
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-4">{children}</div>
      </div>
    </div>
  );
}
