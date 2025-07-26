import Markdown from 'react-markdown';

export default async function MarkdownPreview() {
  try {
    const markdown = `
\`\`\`python
class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    repository_location = models.URLField()
    submission_location = models.URLField()
    team = models.OneToOneField(Team, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name}"
\`\`\`
`;
    return <Markdown>{markdown}</Markdown>;
  } catch (err) {

    return (
      <main>
        <h1 className="text-4xl text-center">Hardware</h1>
        <p className="text-lg text-center text-red-600">
          Sorry, an error happened. Check the server logs.
        </p>
      </main>
    );
  }
}
