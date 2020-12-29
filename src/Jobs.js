import React, {useState} from 'react';
import { Card, Badge, Button,Collapse } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

export default function Jobs({ jobs }) {
    const[open, setOpen] = useState(false)
    return (
        <Card className="mb-3">
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <div>
                        <Card.Title>
                            {jobs.title} - <span className="text-muted font-weight-light">{jobs.company}</span>
                        </Card.Title>
                        <Card.Subtitle className = "text-muted mb-2">
                            {new Date(jobs.created_at).toLocaleDateString()}
                        </Card.Subtitle>
                        <Badge variant = "secondary" className= "mr-2">
                            {jobs.type}
                        </Badge>
                        <Badge variant = "secondary">
                            {jobs.location}
                        </Badge>
                        <div style = {{wordBreak:'break-all'}}>
                            <ReactMarkdown source= {jobs.how_to_apply}/>
                        </div>
                    </div>
                    <img className="d-sm-none d-md-block" height="50" alt={jobs.company} src={jobs.company_logo}/>
                </div>
                <Card.Text>
                    <Button onClick={() => setOpen(prevOpen => !prevOpen)} variant="primary">{open ? "Hide Details": "View Details"}</Button>
                </Card.Text>
                <Collapse in = {open}>
                    <div className="mt-4">
                    <ReactMarkdown source={jobs.description}/>
                </div>
                </Collapse>
            </Card.Body>
        </Card>
    )
}