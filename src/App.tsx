import { Reorder } from "framer-motion";
import { PlusCircleIcon } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { useState } from "react";
import { Button } from "./components/Button";
import { LinkItem } from "./components/LinkItem";


export function App() {
  const form = useForm({
    defaultValues: {
      links: [
        { title: 'Link 01', url: 'https://jstack.com.br' },
        { title: 'Link 02', url: 'https://instagram.com' },
      ],
    },
  });
  const links = useFieldArray({
    control: form.control,
    name: 'links',
  });
  
  const [draggingIndex, setDraggingIndex] = useState<null | number>(null);

  const handleSubmit = form.handleSubmit(formData => {
    console.log(formData)
  });

  function handleDragStart(index: number) {
    setDraggingIndex(index);
  }

  function handleDragEnd() {
    setDraggingIndex(null);
  }

  function handleReorder(newOrder: typeof links.fields) {
    if (draggingIndex === null)  {
      return;
    }

    const draggingLink = links.fields[draggingIndex];

    newOrder.forEach((link, index) => {
      if (link === draggingLink) {
        links.move(draggingIndex, index);
        setDraggingIndex(index);
      }
    });
  }

  return (
    <div className="grid place-items-center min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-10">Links</h1>

        <Button
          type="button"
          className="w-full border-dashed mb-6"
          variant="outline"
          onClick={() => {
            links.prepend({ title: '', url: '' });
          }}
        >
          <PlusCircleIcon className="size-4 mr-1" />
          Adicionar no topo da lista
        </Button>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Reorder.Group
              axis="y"
              values={links.fields}
              onReorder={handleReorder}
              className="space-y-4"
            >
              {links.fields.map((link, index) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  index={index}
                  isDraggingActive={draggingIndex === null ? null : draggingIndex === index}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onRemove={() => links.remove(index)}
                />
              ))}
            </Reorder.Group>

            <Button
              type="button"
              className="w-full border-dashed mt-6"
              variant="outline"
              onClick={() => {
                links.append({ title: '', url: 'https://' });
              }}
            >
              <PlusCircleIcon className="size-4 mr-1" />
              Adicionar novo Link
            </Button>

            <div className="flex gap-4">
              <Button
                className="flex-1"
                type="button"
                variant="secondary"
                onClick={() => links.insert(1, { title: '', url: '' })}
              >
                Insert
              </Button>
              <Button
                className="flex-1"
                type="button"
                variant="secondary"
                onClick={() => links.move(3, 1)}
              >
                Move
              </Button>
              <Button
                className="flex-1"
                type="button"
                variant="secondary"
                onClick={() => links.replace([])}
              >
                Replace
              </Button>
              <Button
                className="flex-1"
                type="button"
                variant="secondary"
                onClick={() => links.swap(3, 1)}
              >
                Swap
              </Button>
              <Button
                className="flex-1"
                type="button"
                variant="secondary"
                onClick={() => {
                  // links.update(1, { title: 'Updated title', url: 'Updated URL' })
                  form.setValue('links.1.title', 'Updated title');
                  form.setValue('links.1.url', 'Updated URL');
                }}
              >
                Update
              </Button>
            </div>

            <Button type="submit" className="w-full">Enviar</Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}