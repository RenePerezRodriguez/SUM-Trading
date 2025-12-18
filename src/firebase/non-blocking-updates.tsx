'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
  FirestoreError
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export async function setDocumentNonBlocking(docRef: DocumentReference, data: any, options?: SetOptions) {
  try {
    if (options) {
      await setDoc(docRef, data, options);
    } else {
      await setDoc(docRef, data);
    }
  } catch (error) {
    if (error instanceof FirestoreError && error.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'write',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw the specific error so the calling function knows it failed
        throw permissionError;
    }
    // Re-throw other types of errors
    throw error;
  }
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export async function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  try {
    return await addDoc(colRef, data);
  } catch (error) {
    if (error instanceof FirestoreError && error.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError;
    }
    throw error;
  }
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export async function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
    try {
        await updateDoc(docRef, data);
    } catch (error) {
        if (error instanceof FirestoreError && error.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: data,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw permissionError;
        }
        throw error;
    }
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export async function deleteDocumentNonBlocking(docRef: DocumentReference) {
    try {
        await deleteDoc(docRef);
    } catch (error) {
        if (error instanceof FirestoreError && error.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
            throw permissionError;
        }
        throw error;
    }
}
