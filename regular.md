#### Personal project JavaScript

**Complexity**: Regular

**Name**: Module for school management

Implement a school management system.

**List of Models**

- LMS
- Teachers
- Pupils
- Groups
- Gradebooks

**LMS**

```json
Subject
{
  "title": "string",
  "lessons": "number",
  "description": "string"
}

const history = new Subject({
  title: 'History',
  lessons: 24
});

// will return subjectId
history.id

const lms = new LMS();
lms.remove(history);
lms.add(history);

// will return true or false. Answer will be true if we added this subject to lms
lms.verify(history);

// will return array of registered subjects
lms.readAll();
[
  {
    subjectId: null
  }
]

```

**Teachers** 

```json
// Teacher's schema
{
  "name": {
    "first": "string",
    "last": "string"
  },
  "image": "string",
  "dateOfBirth": "string", // format date
  "emails": [
    {
      "email": "string",
      "primary": "boolean"
    }
  ],
  "phones": [
    {
      "phone": "string",
      "primary": "boolean"
    }
  ],
  "sex": "string", // male or female
  "subjects": [
    {
      "subject": "string"
    }
  ],
  "description": "string",
}
// all fields are required, except description

// Create new Teacher from Teacher's data
const teachers = new Teachers();

// Create a new teacher
const teacherId = teachers.add(data);

// will return Teachers data including teacher's id
teachers.read(teacherId)

// will update Teacher. This method should use the same validation as a constructor method
const teacherId = teachers.update(teacherId, updatedProfile)

// will remove teacher
teachers.remove(teacherId)
```

**Pupils**

```json
// Pupil's Schema
{
  "name": {
    "first": "string",
    "last": "string"
  },
  "image": "string",
  "dateOfBirth": "string", // format date
  "phones": [
    {
      "phone": "string",
      "primary": "boolean"
    }
  ],
  "sex": "string", // male OR female
  "description": "string"
}
// all fields are required, except description

// Create new Pupil from Pupil's data
const pupils = new Pupils();

// Create a new pupil
const pupil = pupils.add(data);

// will return Pupils data including pupil's id
pupils.read(pupil.id)

// will update Pupil. This method should use the same validation as a constructor method
pupils.update(pupil.id, updatedProfile)

// will remove pupil
pupils.remove(pupil.id)
```

**Groups**

```json
const room = 236;
const groups = new Groups();

// Create a new group
const groupId = groups.add(room);

// Remove this pupil from this group
groups.removePupil(groupId, pupil.id);

// Add this pupil to this group
groups.addPupil(groupId, pupil);

// Update room for this group
groups.update(groupId, {
  room: 237
});

// Read information about group
groups.read(groupId);
{
  id: 'JEF5H43H'
  room: 237
}

// It will return array of groups
groups.readAll()

```

**Gradebooks**

```javascript
const pupilId = pupil.id;
const teacherId = teacherId;
const gradebooks = new Gradebooks(groups, teachers, lms);

// Create a new gradebook
const level = 1;
const gradebook = gradebooks.add(level, group.id);

// Destroy all data inside this gradebook
gradebooks.clear();

const record = {
  pupilId: pupilId,
  teacherId: teacherId,
  subjectId: history.id,
  lesson: 1,
  mark: 9
};

gradebooks.addRecord(gradebookId, record);

// Read information about oliver results
const oliver = gradebooks.read(gradebookId, pupilId);
{
  name: 'Oliver Black',
  records: [
    {
      teacher: 'Elizabeth Holms',
      subject: 'History',
      lesson: 1,
      mark: 9
    }
  ]
}

// Read information about all students in this gradebook
const students = gradebooks.readAll(gradebookId); // It will return the array of objects
```