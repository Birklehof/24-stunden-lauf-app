import { FirestoreError, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Options } from 'react-firebase-hooks/firestore/dist/firestore/types';

export default function useCollectionAsDict<CollectionType>(
  collectionName: string,
  options?: Options | undefined
) {
  const [collectionContent, setCollectionContent] = useState<{
    [id: string]: CollectionType;
  }>({});
  const [snapshot, loading, error] = useCollection(
    collection(db, collectionName),
    options
  );

  useEffect(() => {
    const newCollectionContent: {
      [id: string]: CollectionType;
    } = {};
    snapshot?.docs.map((doc) => {
      const data = doc.data();
      newCollectionContent[doc.id] = {
        id: doc.id,
        ...data,
      } as CollectionType;
    });
    setCollectionContent(newCollectionContent);
  }, [snapshot]);

  return [collectionContent, loading, error] as [
    {
      [id: string]: CollectionType;
    },
    boolean,
    FirestoreError | undefined
  ];
}
