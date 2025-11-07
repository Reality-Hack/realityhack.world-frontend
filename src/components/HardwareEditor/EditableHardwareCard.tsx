import { useState } from "react";
import { useSession } from "next-auth/react";
import { useHardwareContext } from "@/contexts/HardwareContext";
import { 
    HardwareCategory, 
    hardware_categories, 
    CreateHardware,
} from "@/types/types2";
import { 
    FileUpload, 
    PatchedHardwareCreateRequest, 
    HardwareCreateRequest, 
    FileUploadRequest 
} from "@/types/models";
import { uploadedFilesCreate } from "@/types/endpoints";
import { hardwarePartialUpdate } from "@/types/endpoints";
import { hardwareCreate } from "@/types/endpoints";
import { hardwareDestroy } from "@/types/endpoints";
import HardwareDevicesEditor from "./HardwareDevicesDialog";
import Dropzone from '@/components/Dropzone';
import { fixFileLink } from '@/app/api/uploaded_files';
import { toast } from 'sonner';
import CloseIcon from '@mui/icons-material/Close';

// TODO: optimistically update hardware device changes (create, delete)
export default function EditableHardwareCard({  
    item,
    hardwareCategories,
    topLevelProps = {},
    removeUserCreatedHardware
  }: {
    item: CreateHardware;
    hardwareCategories: HardwareCategory[];
    topLevelProps?: any;
    removeUserCreatedHardware: () => void;
  }) {
    const { data: session } = useSession();
    const isPersistedToDB = item?.id;
    const [image, setImage] = useState<null | FileUpload>(item?.image || null);
    const [editingImage, setEditingImage] = useState(image == null);
    const [name, setName] = useState(item.name);
    const [quantity, setQuantity] = useState(item.total);
    const [description, setDescription] = useState(item.description);
    const [tags, setTags] = useState(item.tags);
    const { mutateHardwareDeviceTypes } = useHardwareContext();
    const hasChanged =
      name !== item.name ||
      quantity !== item.total ||
      description !== item.description ||
      image?.id !== item.image?.id ||
      tags !== item.tags;
    const [addTagOpen, setAddTagOpen] = useState(false);
    const [hardwareDevicesEditorOpen, setHardwareDevicesEditorOpen] =
      useState(false);
    const isReady =
      name.length > 0 && quantity && quantity > 0 && description && description.length > 0 && image != null;
  
    // is the hardware being saved to the database?
    const [sending, setSending] = useState(false);
  
    if (!session) return null;
  
    // handle dropzone changes -- ideally does not automatically save the upload
    async function setAcceptedFiles(
      acceptedFiles: File[] | ((prevState: File[]) => File[])
    ) {
      if (typeof acceptedFiles === 'function') {
        acceptedFiles = acceptedFiles([]);
      }
      const validFile = acceptedFiles[0] as Blob;
      const fileUploadRequest: FileUploadRequest = {
        file: validFile
      };
      uploadedFilesCreate(fileUploadRequest, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        setImage(res);
        setEditingImage(false);
      }).catch(err => {
        toast.error('Failed to upload image');
      })
    }
  
    function saveHardware() {
      setSending(true);
      if (isPersistedToDB) {
        const payload: PatchedHardwareCreateRequest = {
          name: name,
          description: description,
          image: image?.id,
          tags: tags.map(tag => tag)
        };
        hardwarePartialUpdate(item.id, payload, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        })
        .then(res => {
          toast.success('Hardware updated successfully');
          mutateHardwareDeviceTypes();
        })
        .catch(err => {
          toast.error('Failed to update hardware');
        })
        .finally(() => {
          setSending(false);
        });
      } else {
        const payload: HardwareCreateRequest = {
          name: name,
          description: description,
          image: image?.id,
          tags: tags.map(tag => tag)
        };
        hardwareCreate(payload, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        })
        .then(res => {
          toast.success('Hardware created successfully');
          mutateHardwareDeviceTypes();
          removeUserCreatedHardware();
        })
        .catch(err => {
          toast.error('Failed to create hardware');
        })
        .finally(() => {
          setSending(false);
        });
      }
    }
  
    return (
      <div
        {...topLevelProps}
        key={item?.id || item?.name}
        className="flex-col gap-2 w-[355px] bg-gradient-to-t from-[#FFFFFF] to-[#FFFFFF] border border-blue-500 rounded-[10px] shadow flex justify-center items-center p-2"
      >
        {editingImage ? (
          <>
            <Dropzone
              acceptedFiles={[]}
              rejectedFiles={[]}
              setAcceptedFiles={setAcceptedFiles}
              setRejectedFiles={() => {}}
              setFormData={() => {}}
            ></Dropzone>
          </>
        ) : (
          <div className="flex flex-col items-center" key={item?.id || item?.name}>
            {/* we know image is not null when there is no editing */}
            <img src={fixFileLink(image!.file)} className="rounded-xl" />
            {/* <Image src={image!.file} width={512} height={512} className="rounded-xl" ></Image> */}
            <button onClick={() => setEditingImage(true)}>Replace image</button>
          </div>
        )}
        <div className="flex justify-between w-full">
          <span className="text-xl">
            <input
              placeholder="Enter name"
              value={name}
              className="m-1 shadow-md rounded-md px-1 border"
              onChange={e => setName(e.target.value)}
            ></input>
          </span>
          <div className="relative">
            {hardwareDevicesEditorOpen && (
              <div className="absolute left-0 top-10 rounded-md shadow-xl bg-white z-10">
                <div className="flex justify-end">
                  <button
                    className="px-2 py-2 rounded-full text-black"
                    onClick={() => setHardwareDevicesEditorOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <HardwareDevicesEditor hardware={item} />
              </div>
            )}
          </div>
          <button
            className="cursor-pointer text-black bg-gray-200 px-4 py-2 rounded-full disabled:opacity-50 transition-all flex-shrink self-end"
            onClick={() =>
              setHardwareDevicesEditorOpen(!hardwareDevicesEditorOpen)
            }
            disabled={!isPersistedToDB}
          >
            Edit devices
          </button>
        </div>
        <textarea
          className="mt-4 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 mr-2 required"
          name="description"
          placeholder="Hardware description"
          value={description}
          rows={4}
          onChange={event => setDescription(event.target.value)}
        ></textarea>
        <div className="flex w-full flex-wrap flex-initial">
          {tags.map((tag, idx) => (
            <span className="bg-gray-200 rounded-full px-2 py-1 m-1" key={`item-${item.id}-tag-${idx}-${tag}`}>
              {hardware_categories[tag] /*tag.display_name*/}
              <button
                onClick={() =>
                  setTags(tags.filter(existingTag => existingTag != tag))
                }
              >
                <CloseIcon />
              </button>
            </span>
          ))}
          <div className="relative bg-gray-200 rounded-full px-2 py-0 mx-1 text-xl">
            {addTagOpen && (
              <div className="absolute left-10 top-5 rounded-md shadow-xl bg-white z-10">
                <button
                  className="p-4 px-4 py-2 rounded-full text-black mx-4"
                  onClick={() => setAddTagOpen(false)}
                >
                  <CloseIcon />
                </button>
                <div className="w-56 px-5 py-4 my-4 mr-4 content flex flex-initial flex-wrap flex-row">
                  {hardwareCategories
                    // TODO: filter out tags that are already in the list
                    .filter(cat => !tags.includes(cat.value))
                    .map((cat: HardwareCategory, idx: number) => (
                      <div className="m-1" key={`item-${item.id}-tag-${idx}-${cat.value}`}>
                        <button
                          className="cursor-pointer text-white bg-[#493B8A] px-4 rounded-full disabled:opacity-50 transition-all flex-shrink h-10 self-end"
                          // set the updated tags for the current item
                          onClick={() => setTags([...tags, cat.value])}
                        >
                          {hardware_categories[cat.value] /* cat.display_name */}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <button onClick={() => setAddTagOpen(!addTagOpen)} className="py-1">
              +
            </button>{' '}
          </div>
        </div>
        <div className="flex justify-between w-full">
          <button
            disabled={sending || !hasChanged || !isReady}
            className="cursor-pointer text-white bg-[#493B8A] px-4 rounded-full disabled:opacity-50 transition-all flex-shrink h-10 self-end"
            onClick={() => saveHardware()}
          >
            Save
          </button>
          <button
            disabled={sending}
            className="cursor-pointer text-white bg-[#CC2F34] px-4 rounded-full disabled:opacity-50 transition-all flex-shrink h-10 self-end"
            onClick={() => {
              if (!isPersistedToDB) {
                removeUserCreatedHardware();
                return;
              } else {
                setSending(true);
                hardwareDestroy(item.id, {
                  headers: {
                    Authorization: `Bearer ${session?.access_token}`
                  }
                }).then(() => {
                  toast.success('Hardware deleted successfully');
                  mutateHardwareDeviceTypes();
                  setSending(false);
                });
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }