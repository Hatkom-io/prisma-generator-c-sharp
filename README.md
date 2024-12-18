# Generate C# records based on Prisma schema

Input:

```prisma
model Post {
  id Int
  title String
  content String
  published Boolean
  author User
}

model User {
  id Int
  name String
  email String
  posts Post[]
}
```

Output:

```csharp
public record Post(
  int id, 
  string title, 
  string content, 
  bool published, 
  User author
);

public record User(
  int id, 
  string name, 
  string email, 
  Post[] posts
);
```

Supported:

* Scalars
* Enums
* Arrays
* Relations
* Optional fields
