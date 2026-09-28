import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogsDirectory = path.join(process.cwd(), 'public/content/blogs');

export function getBlogBySlug(slug) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(blogsDirectory, `${realSlug}.md`);
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug: realSlug,
      frontmatter: data,
      content,
    };
  } catch (error) {
    console.error(`Error reading blog file ${slug}:`, error);
    return null;
  }
}

export function getAllBlogSlugs() {
  try {
    const files = fs.readdirSync(blogsDirectory);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading blogs directory:', error);
    return [];
  }
}

export function getAllBlogs() {
  const slugs = getAllBlogSlugs();
  const blogs = slugs
    .map(slug => getBlogBySlug(slug))
    .filter(blog => blog !== null)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB - dateA; // Sort by date descending
    });
  
  return blogs;
}