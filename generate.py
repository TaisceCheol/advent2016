import collections,csv,os,json
from random import shuffle,seed,randint
from loremipsum import get_paragraphs
from natsort import natsort

sources = []

def parse_row(item):
	global sources
	for p in item['source / credit'].split(','):
		sources.append(p)
	return {
		'name':item['NAME'],
		'maiden_name':item['MAIDEN NAME'],
		'dob':item['DOB (YYYY)'],
		'source': item['source / credit'], 
		'location':item['LOCATION Hanna checking'],
		'role':item['ROLE'],
		'source':item['source / credit'],
		'date':item['DISP DATE'],
		'audio':item['AUDIO-URL'],
		'description':item['Description'],
		'video':item['VIDEO-URL'],
		'video_description':item['VIDEO DESCRIPTION'],
		'intro':item['INTRODUCTION'].lstrip("<p>").rstrip("</p>"),
		'image': item['IMAGE-URL'],
		'dimensions':item['IMG_DIM'],
		'copyright':item['Copyright']
	}

def generate_struct(data,index):
	struct = collections.OrderedDict()
	struct['draft'] = 'False'
	struct['name'] = data['name']
	struct['maiden_name'] = data['maiden_name']
	if not data['dob'].startswith('ca'): 
		struct['dob'] =  "b. %s" % data['dob']
	else:
		struct['dob'] = data['dob']
	struct['location'] = data['location']
	struct['role'] = data['role']
	struct['source'] = data['source']
	struct['image'] = data['image']
	struct['audio'] = data['audio']
	struct['description'] = data['description']
	struct['video'] = data['video']
	struct['video_description'] = data['video_description']
	struct['Description'] = "Irish Traditional Music Archive Advent Calendar 2016"
	struct['content'] = data['intro']
	struct['date'] = data['date']
	struct['dimensions'] = data['dimensions']
	struct['copyright'] = data['copyright']
	return struct 

def format_cluster(data):
	struct = collections.OrderedDict()
	index = int(data[0]['date'])
	struct['date'] = '2016-12-%02d' % index
	struct['title'] = "Advent Day %d" % index
	struct['cluster_title'] = "Advent Day %d" % index
	struct['weight'] = index	
	struct['slug'] = "day-%d" %  index	
	struct['draft'] = 'False'
	struct['Description'] = "Irish Traditional Music Archive Advent Calendar Exhibiton 2016"
	struct['cluster'] = True
	struct['cluster_data'] = data
	frontmatter = json.dumps(struct,indent=4).decode('UTF-8')
	return "%s\n%s" % (frontmatter,data[0]['content'].decode('UTF-8'))

def group_clusters(data):
	clusters = {}
	for item in data:
		if not item['date'] in clusters:
			clusters[item['date']] = []
		clusters[item['date']].append(item)
	return clusters.values()

target = 'site/content/calendar'
file_name_base = 'day-%d.md'

data_src = 'advent_2016_master.csv'

with open(data_src,'r') as f:
	data = csv.DictReader(f)
	data = filter(lambda x:len(x['DISP DATE']) != 0,data)
	women = [parse_row(x) for x in data]

selection = [generate_struct(x,i) for i,x in enumerate(women)]
clusters = group_clusters(selection)

for item in clusters:
	formatted = format_cluster(item)
	path = os.path.join(target,file_name_base % int(item[0]['date']))
	with open(path,'w') as f:
		f.write(formatted.encode('UTF-8'))

sources = ", ".join(natsort.natsorted(set(filter(lambda x:len(x) > 0,[y.strip().decode('utf-8') for y in set(sources)]))))

# print sources

