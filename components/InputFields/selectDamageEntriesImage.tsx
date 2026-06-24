import React, { useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

interface ImageUploadProps {
  setFieldValue: (field: string, value: any) => void;
  values: string[] | undefined;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setFieldValue, values }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // To reset the input

  // Handle file selection and set images in Formik state
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Limit selection to 3 files
      if (files.length + selectedFiles.length > 3) {
        alert('You can only select up to 3 files.');
        return;
      }

      const newSelectedFiles = [...selectedFiles, ...files];
      setSelectedFiles(newSelectedFiles);

      // Update Formik state
      setFieldValue('couponImage', newSelectedFiles);
    }
  };

  // Remove an image by index and update both local state and Formik state
  const handleDelete = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
    setSelectedFiles(updatedFiles);
    setFieldValue('couponImage', updatedFiles);

       // Reset the file input to allow selecting the same files again
       if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
  };

  // Render image previews with delete buttons
  const renderPreviews = () => {
    return selectedFiles.map((file, index) => {
      const fileURL = URL.createObjectURL(file);
      return (
        <div key={index} style={{ margin: '10px', position: 'relative' }}>
          <img
            src={fileURL}
            alt={`attachment-${index}`}
            width={200}
            height={200}
            style={{ objectFit: 'cover' }}
          />
          {/* Delete button */}
          <button
            type="button"
            onClick={() => handleDelete(index)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '22px'
            }}
          >
            &times;
          </button>
        </div>
      );
    });
  };

  return (
    <div>
        <Row className='py-2' >
            <Col md={11} lg={4} >
      <Form.Group className="form-group">
      <Form.Label htmlFor="Coupon">Select Attachement (Max 3) </Form.Label>
      <Form.Control
            className="mb-1"
            name="couponImage"
            type="file"
            required
            autoComplete="off"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
      </Form.Group>
      </Col>
      <Col  lg={12} >

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderPreviews()}</div>
      </Col>

      </Row>
    </div>
  );
};

export default ImageUpload;
