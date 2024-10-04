const POST_GRAPHQL_FIELDS = `
    sys {
      id
      publishedAt
    }
    title
    featured
    featuredImage {
      url
    }
    trending
    headerImage {
      url
    }
    shortDescription
    slug
    date
    author {
      firstname
      lastname
      picture {
        url  
      }
    }
    contentfulMetadata {
      tags {
        name
      }
    }
`;

const POST_GRAPHQL_FIELDS_SINGLE_ARTICLE = `
    sys {
      id
      publishedAt
    }
    title
    featured
    featuredImage {
      url
    }
    trending
    headerImage {
      url
    }
    shortDescription
    body {
      json
      links {
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
    slug
    date
    author {
      firstname
      lastname
      picture {
        url  
      }
    }
    contentfulMetadata {
      tags {
        name
      }
    }
`;

async function fetchGraphQL(query: string, preview = false): Promise<any> {
  const url = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;
  const token = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN;

  const body = JSON.stringify({ query });
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
      next: { tags: ["articles"] },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors", result.errors);
      throw new Error(result.errors.map((error: any) => error.message).join(', '));
    }

    return result;
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
}

function extractPost(fetchResponse: any): any {
  return fetchResponse?.data?.articleCollection?.items?.[0];
}

function extractPostEntries(fetchResponse: any): any[] {
  return fetchResponse?.data?.articleCollection?.items;
}

export async function getPreviewPostBySlug(slug: string | null): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      articleCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  );
  return extractPost(entry);
}

export async function getAllPosts(isDraftMode: boolean): Promise<any[]> {
  const entries = await fetchGraphQL(
    `query {
      articleCollection(order: date_DESC, preview: ${
        isDraftMode ? "true" : "false"
      }) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode
  );
  return extractPostEntries(entries);
}

export enum PostType {
  Article = 'article',
  Page = 'page',
}

export async function getPost(
  type: PostType,
  slug: string,
  preview: boolean
): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      ${type}Collection(where: { slug: "${slug}" }, preview: ${
        preview ? "true" : "false"
      }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS_SINGLE_ARTICLE}
        }
      }
    }`,
    preview
  );
  return {
    post: extractPost(entry),
  };
}