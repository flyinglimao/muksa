import { Dialog } from "@headlessui/react"

type Props = {
  onClose: () => any
  open: boolean
  title: string
  content: string
  buttons: {
    onClick: () => any
    text: string
    className?: string
  }[]
}

export function Modal(props: Props) {
  return (
    <Dialog as="div" className="relative z-10" onClose={props.onClose} open={props.open}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
              {props.title}
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{props.content}</p>
            </div>

            <div className="mt-4">
              {props.buttons.map((btn, idx) => (
                <button
                  type="button"
                  className={
                    "mr-4 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus-visible:ring-offset-2 " +
                    btn.className
                  }
                  onClick={btn.onClick}
                  key={"modal-btn-" + idx}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
