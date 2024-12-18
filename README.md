# Generate C# records based on Prisma schema

Input:

```prisma
model User {
  id: Int
  name: String
  email: String
  posts: Post[]
}
```

Output:

```csharp
public record User(
  int Id, 
  string Name, 
  string Email, 
  Post[] Posts
);
```

Supported:

* Scalars
* Enums
* Arrays
* Relations
* Optional fields
