'use client';
import CloseIcon from '@mui/icons-material/Close';
import { Save } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import {
  HardwareCategory,
  hardware_categories,
} from '@/types/types2';
import {
  FileUpload,
  HardwareDevice,
  FileUploadRequest,
  PatchedHardwareCreateRequest,
  HardwareCreateRequest,
  HardwareDeviceRequest,
  PatchedHardwareDeviceRequest,
} from '@/types/models'
import Dropzone from '@/components/Dropzone';
import { fixFileLink } from '@/app/api/uploaded_files';
import HardwareCategoryFilter from '@/components/hardware/HardwareCategoryFilter';
import { CircularProgress, LinearProgress } from '@mui/material';
import { toast } from 'sonner';
import { CreateHardware, TaggedHardware } from '@/types/types2';
import { useHardwareContext } from '@/contexts/HardwareAdminContext';
import { 
  uploadedFilesCreate, 
  hardwarePartialUpdate, 
  hardwareCreate, 
  hardwareDestroy, 
  hardwaredevicesCreate, 
  hardwaredevicesPartialUpdate,
  hardwaredevicesDestroy,
} from '@/types/endpoints';


export default function HardwareEditor({
  hardware,
  hardwareCategories
}: {
  hardware: TaggedHardware[];
  hardwareCategories: HardwareCategory[];
}) {
  const { hardwareDeviceTypes } = useHardwareContext();
  const [hardwareList, setHardwareList] = useState<CreateHardware[]>([]);
  const [search, setSearch] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState(
    Object.fromEntries(
      hardwareCategories.map((cat: HardwareCategory) => [cat.value, false])
    )
  );

  useEffect(() => {
    if (hardwareDeviceTypes) {
      setHardwareList(hardwareDeviceTypes);
    }
  }, [hardwareDeviceTypes]);

  const filteredHardware = useMemo(() => {
    if (!hardwareDeviceTypes) return [];
    return hardwareList.filter((item: CreateHardware) => {
      const passesTagFilter = selectAll ||
        item.tags.some(
          tag => selected[tag || (tag as unknown as string)]
        ) ||
        !Object.entries(selected).some(([_, val]) => val);
      
      const passesSearchFilter = !search ||
        item.name.toLowerCase().includes(search.toLowerCase());
      
      return passesTagFilter && passesSearchFilter;
    });
  }, [hardwareList, selected, selectAll, search]);

  // add a new hardware device type to the existing list
  function addNew() {
    setHardwareList([
      {
        id: '',
        name: '',
        total: 1,
        available: 1,
        description: '',
        image: null,
        checked_out: 0,
        tags: []
      },
      ...hardwareList
    ]);
  }
  return (
    <div>
      <button
        className="cursor-pointer text-white bg-[#493B8A] p-4 m-4 rounded-full disabled:opacity-50 transition-all h-15 self-end flex flex-row"
        onClick={() => addNew()}
      >
        <span className="text-3xl">+</span>{' '}
        <span className="py-2 px-2">add new</span>
      </button>
      <HardwareCategoryFilter/>
      <div className="flex flex-wrap justify-left gap-6 ml-6 mt-14">
        {filteredHardware.map((item: any, i: number) => (
          <EditableHardwareCard
            item={item}
            setItem={newItem =>
              // handle updating local list with changes from a hardware card
              setHardwareList(
                hardwareList.map(item =>
                  (
                    item.id
                      ? item.id === newItem.id
                      : item.name === newItem.name
                  )
                    ? newItem
                    : item
                )
              )
            }
            removeItem={() =>
              // remove the item from the list
              setHardwareList(
                hardwareList.filter(it =>
                  it.id ? it.id !== item.id : it.name !== item.name
                )
              )
            }
            key={item.id || item.name}
            hardwareCategories={hardwareCategories}
            topLevelProps={{
              'data-testid': `hardware-request-hardware-${i}`
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EditableHardwareCard({
  item,
  setItem,
  removeItem,
  hardwareCategories,
  topLevelProps = {}
}: {
  item: CreateHardware;
  setItem: (item: CreateHardware) => void;
  removeItem: () => void;
  hardwareCategories: HardwareCategory[];
  topLevelProps?: any;
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
      })
      .catch(err => {
        toast.error('Failed to update hardware');
      })
      .finally(() => {
        setSending(false);
        mutateHardwareDeviceTypes();
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
      })
      .catch(err => {
        toast.error('Failed to create hardware');
      })
      .finally(() => {
        setSending(false);
        mutateHardwareDeviceTypes();
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
              removeItem();
              return;
            } else {
              setSending(true);
              hardwareDestroy(item.id, {
                headers: {
                  Authorization: `Bearer ${session?.access_token}`
                }
              }).then(() => {
                setSending(false);
                removeItem();
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

function HardwareDevicesEditor({ hardware }: { hardware: CreateHardware }) {
  const { data: session } = useSession();
  const { hardwareDevices, isLoadingHardwareDevices } = useHardwareContext();
  const [devices, setDevices] = useState<Partial<HardwareDevice>[]>([]);
  useEffect(() => {
    if (hardwareDevices) {
      setDevices(hardwareDevices);
    }
  }, [hardwareDevices]);

  function addNew() {
    setDevices([
      ...devices,
      {
        id: '',
        serial: Math.random().toString(36).substring(7),
        checked_out_to: null,
        hardware: hardware.id
      }
    ]);
  }

  return (
    <div className="w-56 px-5 py-4 my-4 mr-4">
      <p>{isLoadingHardwareDevices ? 'Loading...' : `${hardwareDevices?.length || 0} devices.`}</p>
      <p className="mt-1">
        <button
          className="cursor-pointer text-white bg-[#493B8A] py-1 px-2 rounded-full disabled:opacity-50 transition-all h-15"
          onClick={() => addNew()}
        >
          + add new
        </button>
      </p>
      <div className="content flex flex-col max-h-64 overflow-scroll mt-4">
        {isLoadingHardwareDevices ? (
          <CircularProgress />
        ) : (
          hardwareDevices && hardwareDevices.length > 0 ?
          hardwareDevices
            .reverse()
            .map((device, i) => (
              <HardwareDeviceEditor
                key={`item-${hardware.id}-device-${i}-${device.id}-${device.serial}`}
                device={device}
                access_token={session?.access_token}
                deleteDevice={() =>
                  setDevices(
                    devices.filter(
                      (dev, ind) =>
                        dev.id + dev.serial! !==
                        (dev.id ? device.id : '') + device.serial!
                    )
                  )
                }
                setDevice={device =>
                  setDevices(
                    devices.map((dev, ind) =>
                      dev.id + dev.serial! !==
                      (dev.id ? device.id : '') + device.serial!
                        ? dev
                        : device
                    )
                  )
                }
                index={i + 1}
              />
            ))
          :
          <p>No devices found</p>
        )}
      </div>
    </div>
  );
}

function HardwareDeviceEditor({
  device,
  access_token,
  deleteDevice,
  setDevice,
  index
}: {
  device: Partial<HardwareDevice>;
  access_token?: string;
  deleteDevice: () => void;
  setDevice: (device: Partial<HardwareDevice>) => void;
  index?: number;
}) {
  const [loading, setLoading] = useState(false);
  const isPersistedToDB = device.id;
  const [serial, setSerial] = useState(device.serial || '');
  const [lastSavedSerial, setLastSavedSerial] = useState(device.serial || '');
  const hasChanged = serial !== lastSavedSerial;

  function save() {
    if (!device.hardware || !access_token) {
      toast.error('Failed to save hardware device');
      return
    };
    
    const deviceData = { serial: serial, hardware: device.hardware };
    
    setDevice({
      ...device,
      serial: serial
    });
    
    if (!isPersistedToDB) {
      const payload: HardwareDeviceRequest = { ...deviceData };
      setLoading(true);
      hardwaredevicesCreate(payload, {
        headers: { Authorization: `Bearer ${access_token}` }
      })
      .then(res => {
        setDevice({
          id: res.id,
          serial: res.serial,
          hardware: device.hardware
        });
        setSerial(res.serial);
        setLastSavedSerial(res.serial);
        toast.success('Hardware device created successfully');
      })
      .catch(err => {
        setDevice({
          ...device,
          serial: device.serial
        });
        setSerial(device.serial || '');
        toast.error('Failed to create hardware device');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(true);
      const payload: PatchedHardwareDeviceRequest = {
        ...deviceData,
      }
      hardwaredevicesPartialUpdate(device.id, payload, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
        .then(res => {
          setDevice({
            ...device,
            serial: res.serial
          });
          setSerial(res.serial);
          setLastSavedSerial(res.serial);
          toast.success('Hardware device updated successfully');
        })
        .catch(err => {
          toast.error('Failed to update hardware device');
        })
        .finally(() => setLoading(false));
    }
  }

  function remove() {
    if (!isPersistedToDB) {
      deleteDevice();
    } else if (access_token) {
      setLoading(true);
      hardwaredevicesDestroy(device.id, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
        .then(() => {
          deleteDevice();
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="flex">
      {index}.
      <button className="text-[#CC2F34]" onClick={remove} disabled={loading}>
        <CloseIcon />
      </button>
      {hasChanged || !isPersistedToDB ? (
        <button className="text-[#493B8A]" onClick={save} disabled={loading}>
          <Save />
        </button>
      ) : null}
      <input
        value={serial}
        onChange={e => setSerial(e.target.value)}
        disabled={loading}
        className="m-0.5 shadow-md rounded-md px-1 border"
      ></input>
    </div>
  );
}
