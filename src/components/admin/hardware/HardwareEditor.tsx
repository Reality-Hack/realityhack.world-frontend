'use client';
import { fileUpload } from '@/app/api/application';
import {
  createHardware,
  createHardwareDevice,
  deleteHardware,
  deleteHardwareDevice,
  getHardwareDevice,
  sendHardwareRequest,
  updateHardware,
  updateHardwareDevice
} from '@/app/api/hardware';
import CloseIcon from '@mui/icons-material/Close';
import { PlusOne, Save } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Hardware,
  HardwareCategory,
  HardwareDevice,
  UploadedFile,
  hardware_categories
} from '@/types/types';
import Dropzone from '@/components/Dropzone';
import { fixFileLink } from '@/app/api/uploaded_files';
import HardwareCategoryFilter from '@/components/HardwareCategoryFilter';
import { CircularProgress, LinearProgress } from '@mui/material';
import { TrashIcon } from '@heroicons/react/20/solid';
import { toast } from 'sonner';

export default function HardwareEditor({
  hardware,
  hardwareCategories
}: {
  hardware: Hardware[];
  hardwareCategories: HardwareCategory[];
}) {
  const [hardwareList, setHardwareList] = useState(hardware);
  const [search, setSearch] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState(
    Object.fromEntries(
      hardwareCategories.map((cat: HardwareCategory) => [cat.value, false])
    )
  );

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
      <HardwareCategoryFilter
        hardwareCategories={hardwareCategories}
        search={search}
        setSearch={setSearch}
        selected={selected}
        setSelected={setSelected}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      ></HardwareCategoryFilter>
      <div className="flex flex-wrap justify-left gap-6 ml-6 mt-14">
        {hardwareList
          .filter(
            (item: Hardware) =>
              (selectAll ||
                item.tags.some(
                  tag => selected[tag?.value || (tag as unknown as string)]
                ) ||
                !Object.entries(selected).some(([_, val]) => val)) &&
              (!search ||
                item.name.toLowerCase().includes(search.toLowerCase()))
          )
          .map((item: any, i: number) => (
            <EditableHardwareCard
              item={item}
              setItem={newItem =>
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
  item: Hardware;
  setItem: (item: Hardware) => void;
  removeItem: () => void;
  hardwareCategories: HardwareCategory[];
  topLevelProps?: any;
}) {
  const { data: session } = useSession();
  const isOriginal = !item.id;
  const [image, setImage] = useState<null | UploadedFile>(item.image);
  const [editingImage, setEditingImage] = useState(image == null);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.total);
  const [description, setDescription] = useState(item.description);
  const [tags, setTags] = useState(item.tags);
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
    name.length > 0 && quantity > 0 && description.length > 0 && image != null;
  const [sending, setSending] = useState(false);

  if (!session) return null;

  async function setAcceptedFiles(
    acceptedFiles: File[] | ((prevState: File[]) => File[])
  ) {
    if (typeof acceptedFiles === 'function') {
      acceptedFiles = acceptedFiles([]);
    }
    fileUpload(session?.access_token, acceptedFiles[0]).then(res => {
      setImage(res);
      setEditingImage(false);
    });
  }

  function saveHardware() {
    const data = {
      id: item.id,
      name: name,
      total: quantity,
      description: description,
      image: image?.id,
      tags: tags.map(tag => tag.value)
    };
    const newItem = {
      ...item,
      ...data,
      image: image,
      tags: tags
    };
    setSending(true);
    if (!isOriginal) {
      updateHardware(session!.access_token, data)
        .then(res => {
          toast.success('Hardware updated successfully');
          setItem(newItem);
        })
        .catch(err => {
          toast.error('Failed to update hardware');
        })
        .finally(() => setSending(false));
    } else {
      createHardware(session!.access_token, data)
        .then(res => {
          console.log(res);
          toast.success('Hardware created successfully');
          setItem({
            ...newItem,
            id: res.id
          });
        })
        .catch(err => {
          toast.error('Failed to create hardware');
        })
        .finally(() => setSending(false));
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
          disabled={isOriginal}
        >
          Edit devices
        </button>
      </div>
      <textarea
        // disabled={quantity === 0}
        className="mt-4 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 mr-2 required"
        name="description"
        placeholder="Hardware description"
        value={description}
        rows={4}
        onChange={event => setDescription(event.target.value)}
      ></textarea>
      <div className="flex w-full flex-wrap flex-initial">
        {tags.map((tag, idx) => (
          <span className="bg-gray-200 rounded-full px-2 py-1 m-1" key={`item-${item.id}-tag-${idx}-${tag.value}`}>
            {hardware_categories[tag.value] /*tag.display_name*/}
            <button
              onClick={() =>
                setTags(tags.filter(other => other.value != tag.value))
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
                  .filter(cat => !tags.includes(cat))
                  .map((cat: HardwareCategory, idx: number) => (
                    <div className="m-1" key={`item-${item.id}-tag-${idx}-${cat.value}`}>
                      <button
                        className="cursor-pointer text-white bg-[#493B8A] px-4 rounded-full disabled:opacity-50 transition-all flex-shrink h-10 self-end"
                        onClick={() => setTags([...tags, cat])}
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
        {/* <textarea
        disabled={quantity === 0}
        className='mt-4 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 mr-2 required'
        name="reason" placeholder="Reason for request" value={reason} rows={2}
        onChange={event => setReason(event.target.value)}></textarea> */}
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
            if (isOriginal) {
              removeItem();
              return;
            } else {
              setSending(true);
              deleteHardware(session!.access_token, item.id).then(() => {
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

function HardwareDevicesEditor({ hardware }: { hardware: Hardware }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Partial<HardwareDevice>[]>([]);
  useEffect(() => {
    if (session) {
      setLoading(true);
      getHardwareDevice(session.access_token, { hardware: hardware.id })
        .then(res => {
          setDevices(res);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  function addNew() {
    setDevices([
      ...devices,
      {
        id: '',
        serial: Math.random().toString(36).substring(7),
        checked_out_to: null,
        hardware: hardware
      }
    ]);
  }

  return (
    <div className="w-56 px-5 py-4 my-4 mr-4">
      <p>{loading ? 'Loading...' : `${devices.length} devices.`}</p>
      <p className="mt-1">
        <button
          className="cursor-pointer text-white bg-[#493B8A] py-1 px-2 rounded-full disabled:opacity-50 transition-all h-15"
          onClick={() => addNew()}
        >
          + add new
        </button>
      </p>
      <div className="content flex flex-col max-h-64 overflow-scroll mt-4">
        {loading ? (
          <CircularProgress />
        ) : (
          devices
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
  const isOriginal = !device.id;
  const [serial, setSerial] = useState(device.serial || '');
  const hasChanged = serial !== device.serial;

  function save() {
    if (access_token) {
      if (isOriginal) {
        setLoading(true);
        createHardwareDevice(access_token, {
          serial: serial,
          hardware: device.hardware?.id!
        })
          .then(res => {
            setDevice({
              id: res.id,
              serial: serial,
              hardware: device.hardware
            });
            toast.success('Hardware device created successfully');
          })
          .catch(err => {
            toast.error('Failed to create hardware device');
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(true);
        updateHardwareDevice(access_token, {
          id: device.id,
          serial: serial,
          hardware: device.hardware?.id!
        })
          .then(res => {
            setDevice({
              ...device,
              serial: res.serial
            });
            toast.success('Hardware device updated successfully');
          })
          .catch(err => {
            toast.error('Failed to update hardware device');
          })
          .finally(() => setLoading(false));
      }
    }
  }

  function remove() {
    if (isOriginal) {
      deleteDevice();
    } else if (access_token) {
      setLoading(true);
      deleteHardwareDevice(access_token, device.id!)
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
      {hasChanged || isOriginal ? (
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
