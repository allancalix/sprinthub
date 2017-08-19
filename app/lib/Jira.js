const request = require('request');
const { pick } = require('lodash');

const createJsonEntry = story => {
  const entry = {
    update: {},
    fields: {
      project: {
        key: story.key
      },
      summary: story.name,
      issuetype: {
        name: story.issueType
      }
    }
  };

  const description = parseDescription(story.criteria);

  entry.fields = Object.assign({},
    entry.fields,
    { description },
    story.additionalFields
  );

  return entry;
};

const parseDescription = checklists => {
  let description = '';

  for (let i = 0, j = checklists.length; i < j; i += 1) {
    description += `{panel:title=${checklists[i].name}|borderStyle=solid|borderColor=#ccc|borderWidth=1px}\n`;
    for (let n = 0, m = checklists[i].checkItems.length; n < m; n += 1) {
      description += `{task}${checklists[i].checkItems[n].name}{task}\n`;
    }
    description += '{panel}\n';
  }

  return description;
};

const createTasksRequest = (payload, overwriteDefault = {}) => {
  let options = {
    url: 'https://sprinthub.atlassian.net/rest/api/2/issue/bulk',
    auth: {
      user: '',
      pass: '',
      sendImmediately: true
    },
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(payload)
  };
  options = Object.assign(options, overwriteDefault);
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        reject(error);
      } else if (res.statusCode === 401) {
        reject({ fields: ['password', 'username'], message: 'Invalid credentials.' });
      } else {
        res.statusCode === 200 || res.statusCode === 201
          ? resolve(JSON.parse(body)) : resolve({ error: body });
      }
    });
  });
};

const splitStoryPoints = name => {
  const parsedName = name.match(/\(([^)]+)\) /);
  const storyPoints = parsedName[1];
  const splitName = name.split(parsedName[0])[1];
  return { name: splitName, storyPoints };
};

const makeSubtask = (story, data, requestOptions, extras, form) => {
  console.log(extras);
  const searchLabels = {
    qa: {
      label: 'QA:',
      issuetype: 'Sub-task',
      matchingFields: ['components', 'parent']
    },
    ui: {
      label: 'UI:',
      issuetype: 'Sub-task',
      matchingFields: ['labels', 'parent']
    },
    js: {
      label: 'JS:',
      issuetype: 'Sub-task',
      matchingFields: []
    },
    ta: {
      label: 'TA:',
      issuetype: 'Sub-task',
      matchingFields: []
    },
    unity: {
      label: 'Unity:',
      issuetype: 'Sub-task',
      matchingFields: []
    }
  }
  let createdSubtasks = [];
  const jiraPayload = {
    issueUpdates: []
  };
  for (let label of story.labels) {
    label = label.name.toLowerCase();
    const additionalFields = Object.assign({}, { parent: { key: data.key } }, extras);
    if (searchLabels[label]) {
      jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
        createJsonEntry({
          name: `${searchLabels[label].label} ${story.name}`,
          criteria: story.checklists,
          issueType: searchLabels[label].issuetype,
          key: form.project,
          additionalFields: pick(additionalFields, searchLabels[label].matchingFields)
      })];
    }
  }
  if (jiraPayload.issueUpdates.length > 0) {
    return createTasksRequest(jiraPayload, requestOptions);
  }
  return new Promise(reject => reject('This story needs no subtasks'));
};

exports.fetchIssueFields = (form, cb) => {
  const overwriteDefault = {
    url: `https://${form.domain}/rest/api/2/issue/createmeta?projectKeys=${form.project}`,
    method: 'GET',
    auth: {
      user: form.username,
      pass: form.password,
      sendImmediately: true
    }
  };

  const promise = createTasksRequest(null, overwriteDefault);
  promise.then(data => {
    if (data.projects.length === 0) {
      return cb({ fields: ['project'], message: 'No items found in specified project.' });
    }
    const availableFields = {
      subtasks: [],
      tasks: [],
    };
    for (let i = 0, j = data.projects[0].issuetypes.length; i < j; i += 1) {
      const index = data.projects[0].issuetypes[i];
      const { id, name, iconUrl } = index;
      Object.assign(availableFields,
        data.projects[0].issuetypes[i].subtask ?
        { subtasks: [...availableFields.subtasks, { id, name, iconUrl }] }
        : { tasks: [...availableFields.tasks, { id, name, iconUrl }] });
    }
    return cb(false, availableFields);
  }).catch(error => cb(error));
};

exports.fetchExtendedFields = (form, id, cb) => {
  const overwriteDefault = {
    url: `https://${form.domain}/rest/api/2/issue/createmeta?projectKeys=${form.project}&issueTypeIds=${id}&expand=projects.issuetypes.fields`,
    method: 'GET',
    auth: {
      user: form.username,
      pass: form.password,
      sendImmediately: true
    }
  };

  const promise = createTasksRequest(null, overwriteDefault);
  promise.then((matchingIssueFields) => {
    const possibleMatches = matchingIssueFields.projects[0].issuetypes;
    const matchingField = {};
    for (let i = 0, j = possibleMatches.length; i < j; i += 1) {
      if (possibleMatches[i].name === form.issuetype) {
        matchingField[possibleMatches[i].id] = possibleMatches[i].fields;
      }
    }
    return cb(matchingField);
  });
};


/* This method is used to generate tasks for the start of a sprint */
exports.createTask = (boards, stories, form, extras = {}, cb) => {
  const requestOptions = {
    url: `https://${form.domain}/rest/api/2/issue/bulk`,
    auth: {
      user: form.username,
      pass: form.password
    },
    method: 'POST'
  };

  const storyBoardLists = [];
  boards.map(board =>
    board.trelloLists.map(list =>
      storyBoardLists.push({ sprintName: board.boardName, listId: list.trelloId })
    )
  );

  const jiraPayload = {
    issueUpdates: []
  };

  const orderedStories = [];

  for (let list of storyBoardLists) {
    const storyEntry = stories[list.listId].map(story => {
      orderedStories.push(story);
      const name = (story.name.search(/\(([^)]+)\) /) === 0)
        ? splitStoryPoints(story.name) : { name: story.name, storyPoints: 0 };
      let storyPoints = {};
      if (extras.hasOwnProperty('customfield_10044')) {
        storyPoints = { customfield_10044: parseInt(name.storyPoints) };
      }
      return createJsonEntry({
        name: name.name,
        criteria: story.checklists,
        issueType: form.issuetype,
        key: form.project,
        additionalFields: Object.assign({}, extras, storyPoints)
      });
    });

    jiraPayload.issueUpdates = [...jiraPayload.issueUpdates, ...storyEntry];
  }
  createTasksRequest(jiraPayload, requestOptions).then(data => {
    const jiraIssueMap = {};
    for (let i = 0, j = orderedStories.length; i < j; i += 1) {
      jiraIssueMap[orderedStories[i].id] = data.issues[i];
    }
    const filteredLabeless = orderedStories.filter(story => story.labels.length > 0);
    if (data.errors && data.errors.length === 0) {
      const createdSubtasks = {};
      for (let i = 0, j = filteredLabeless.length; i < j; i += 1) {
        const createSubtask = makeSubtask(
          filteredLabeless[i],
          jiraIssueMap[filteredLabeless[i].id],
          requestOptions,
          extras,
          form
        );
        createSubtask.then(value => {
          createdSubtasks[orderedStories[i].id] = value;
          if (i === j - 1) {
            cb({ success: true, subtasks: createdSubtasks, tasks: data.issues });
          }
        }).catch(e => { console.log(e); });
      }
    }
  });
};
