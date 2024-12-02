import { useEffect, useState } from "react";
import { FileInfo } from "../types/FileInfo";
import { XMLParser } from "fast-xml-parser";

const useFetchList = (query: string) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bucketUrl = "https://sampliopublicmusic.s3.us-west-2.amazonaws.com";

  const fetchAllFiles = async () => {
    setLoading(true);
    setError(null);

    let allFiles: FileInfo[] = [];
    let continuationToken: string | null = null;
    let hasMore = true;

    try {
      const parser = new XMLParser();

      while (hasMore) {
        const url = `${bucketUrl}?list-type=2&max-keys=1000${
          continuationToken
            ? `&continuation-token=${encodeURIComponent(continuationToken)}`
            : ""
        }`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }

        const textResponse = await response.text();
        const parsedData = parser.parse(textResponse);

        const contents = parsedData.ListBucketResult.Contents || [];
        const nextToken = parsedData.ListBucketResult.NextContinuationToken;
        const isTruncated = parsedData.ListBucketResult.IsTruncated === true;

        const fileList = contents
          .map((content: any) => ({
            key: content.Key,
            lastModified: content.LastModified,
            size: parseInt(content.Size, 10),
            fileUri: `${bucketUrl}/${encodeURIComponent(content.Key)}`,
            fileName: content.Key.substring(content.Key.lastIndexOf("/") + 1),
          }))
          .filter((elem: any) => elem.key.endsWith(".mp3"));

        allFiles = [...allFiles, ...fileList];

        continuationToken = nextToken || null;
        hasMore = isTruncated;
      }

      setFiles(allFiles);
    } catch (err: any) {
      console.error("Error fetching all files:", err);
      setError(err.message || "An error occurred while fetching files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query && files && files.length > 0) {
      const filteredFiles = files.filter((elem) =>
        elem.fileName.toLowerCase().includes(query.toLowerCase())
      );
      setFiles([...filteredFiles]);
    } else {
      fetchAllFiles();
    }
  }, [query]);

  return {
    files,
    loading,
    error,
  };
};

export default useFetchList;
