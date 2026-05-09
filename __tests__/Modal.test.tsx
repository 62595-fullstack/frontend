import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "@/components/ui/Modal";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const textField = { name: "title", label: "Title", type: "text" as const };
const requiredTextField = { name: "title", label: "Title", type: "text" as const, required: true };

describe("Modal", () => {
  it("renders the modal title", () => {
    render(
      <Modal title="Create Event" fields={[]} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Create Event")).toBeInTheDocument();
  });

  it("renders field labels", () => {
    render(
      <Modal title="Test" fields={[textField]} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("calls onClose when the × button is clicked", async () => {
    const onClose = vi.fn();
    render(<Modal title="Test" fields={[]} onClose={onClose} onSubmit={vi.fn()} />);
    await userEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the backdrop", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal title="Test" fields={[]} onClose={onClose} onSubmit={vi.fn()} />
    );
    // The outermost div is the backdrop
    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the Cancel button is clicked", async () => {
    const onClose = vi.fn();
    render(<Modal title="Test" fields={[]} onClose={onClose} onSubmit={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows validation error for empty required field on submit", async () => {
    render(
      <Modal
        title="Test"
        fields={[requiredTextField]}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
  });

  it("does not call onSubmit when required field is empty", async () => {
    const onSubmit = vi.fn();
    render(
      <Modal
        title="Test"
        fields={[requiredTextField]}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with form values when valid", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <Modal
        title="Test"
        fields={[requiredTextField]}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );
    await userEvent.type(screen.getByRole("textbox"), "My Event");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: "My Event" }))
    );
  });

  it("shows the custom submit label", () => {
    render(
      <Modal
        title="Test"
        fields={[]}
        submitLabel="Create"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("shows submitting label while onSubmit is in progress", async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn(
      () => new Promise<void>((res) => { resolve = res; })
    );
    render(
      <Modal
        title="Test"
        fields={[textField]}
        submitLabel="Save"
        submittingLabel="Saving…"
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText("Saving…")).toBeInTheDocument();
    resolve();
  });

  it("displays the external error prop", () => {
    render(
      <Modal
        title="Test"
        fields={[]}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        error="Something went wrong"
      />
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders a dropdown field with options", async () => {
    const dropdownField = {
      name: "role",
      label: "Role",
      type: "dropdown" as const,
      options: [
        { value: 1, label: "Admin" },
        { value: 2, label: "Member" },
      ],
    };
    render(
      <Modal title="Test" fields={[dropdownField]} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    // First option is selected by default
    expect(screen.getByText("Admin")).toBeInTheDocument();
    // Opening the dropdown shows all options
    await userEvent.click(screen.getByRole("button", { name: /admin/i }));
    expect(screen.getByText("Member")).toBeInTheDocument();
  });
});
